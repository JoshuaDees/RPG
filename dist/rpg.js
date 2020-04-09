//====================================================================================================================
// Module:    rpg
// Optimized: Yes
// File:      app/app.js
//====================================================================================================================

(function (module) {


//--------------------------------------------------------------------------------------------------------------------
// File: app/providers/restful.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$qProvider', '$resourceProvider', function($qProvider, $resourceProvider) {
      $qProvider.errorOnUnhandledRejections(false);

      $resourceProvider.defaults.cancellable = true;
    }])
    .service('RestfulService', ['$resource', function($resource) {
      return function(url, paramDefaults, actions) {
        var resource = $resource.apply($resource, arguments);

        resource.requests = resource.requests || {};

        resource.abort = function(method) {
          if (method && resource.requests[method]) {
            resoure.requests[method].$cancelRequest();

            delete resource.requests[method];
          } else {
            _.invokeMap(resource.requests, '$cancelRequest');

            resource.requests = {};
          }

          return resource;
        };

        _.forEach(_.keys(actions), function(method) {
          var original = resource[method];

          if (_.isFunction(original)) {
            resource[method] = function() {
              resource.requests[method] = original.apply(resource, arguments);

              return resource.requests[method].$promise;
            };
          }
        });

        return resource;
      }
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/providers/session.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('SessionProvider', [function() {
      return new function() {
        this.set = function(key, value) {
          return sessionStorage.setItem(key, value);
        };

        this.get = function(key) {
          return sessionStorage.getItem(key);
        };

        this.remove = function(key) {
          return sessionStorage.removeItem(key);
        };
      }
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/resources/games.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('GamesResource', ['RestfulService', function(RestfulService) {
      return RestfulService('rest/games.php', null, {
        load: {
          params: { action: 'load' }
        }
      });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/resources/users.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('UsersResource', ['RestfulService', function(RestfulService) {
      return RestfulService('rest/users.php', null, {
        login: {
          method: 'POST',
          params: { action: 'login' }
        },
        logout: {
          method: 'POST',
          params: { action: 'logout' }
        },
        register: {
          method: 'POST',
          params: { action: 'register' }
        }
      });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/games.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games', {
          abstract: true,
          template: '<ui-view />'
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/load.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.load', {
          controller: 'LoadController',
          templateUrl: 'app/templates/games/load.html'
        });
    }])
    .controller('LoadController', [
      '$scope',
      '$state',
      'GamesResource',
      'SessionProvider',
    function(
      $scope,
      $state,
      GamesResource,
      SessionProvider
    ) {
      $scope.model = {
        userId: SessionProvider.get('userId')
      };

      $scope.flags = {
        busy: true
      };

      $scope.load = function() {
        // TODO:
      };

      GamesResource.abort().load($scope.model)
        .then(function(response) {
          if (response.success) {
            $scope.games = response.model;

            if ($scope.games) {
              $scope.model.gameId = $scope.games[0].id;
            }
          } else {
            alert(response.message);
          }
        })
        .catch(function(error) {
          alert(error);
        })
        .finally(function() {
          $scope.flags.busy = false;
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/rpg.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .controller('RPGController', [
      '$scope',
      '$state',
      'SessionProvider',
    function(
      $scope,
      $state,
      SessionProvider
    ) {
      if (SessionProvider.get('userId')) {
        $state.transitionTo('games.load');
      } else {
        $state.transitionTo('users.login');
      }

      $scope.transitionTo = function(state) {
        $state.transitionTo(state);
      };
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/login.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users.login', {
          controller: 'LoginController',
          templateUrl: 'app/templates/users/login.html'
        });
    }])
    .controller('LoginController', [
      '$scope',
      '$state',
      'SessionProvider',
      'UsersResource',
    function(
      $scope,
      $state,
      SessionProvider,
      UsersResource
    ) {
      $scope.flags = {
        busy: false
      };

      $scope.login = function() {
        $scope.flags.busy = true;

        UsersResource.abort().login($scope.model)
          .then(function(response) {
            if (response.success) {
              SessionProvider.set('userId', response.model.id);

              $state.transitionTo('games.load');
            } else {
              alert(response.error);
            }
          })
          .catch(function(error) {
            alert(error);
          })
          .finally(function() {
            $scope.flags.busy = false;
          });
      };
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/logout.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users.logout', {
          controller: 'LogoutController'
        });
    }])
    .controller('LogoutController', [
      '$state',
      'SessionProvider',
      'UsersResource',
    function(
      $state,
      SessionProvider,
      UsersResource
    ) {
      UsersResource.abort().logout()
        .then(function(response) {
          if (response.success) {
            SessionProvider.remove('userId');

            $state.transitionTo('users.login');
          } else {
            alert(response.message);
          }
        })
        .catch(function(error) {
          alert(error);
        })
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/register.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users.register', {
          controller: 'RegisterController',
          templateUrl: 'app/templates/users/register.html'
        });
    }])
    .controller('RegisterController', [
      '$scope',
      '$state',
      'SessionProvider',
      'UsersResource',
    function(
      $scope,
      $state,
      SessionProvider,
      UsersResource
    ) {
      $scope.flags = {
        busy: false
      };

      $scope.register = function() {
        console.log($scope.model);

        if($scope.model.pass === $scope.model.pass2) {
          $scope.flags.busy = true;

          UsersResource.abort().register($scope.model)
            .then(function(response) {
              if (response.success) {
                SessionProvider.set('userId', response.model.id);

                $state.transitionTo('games.load');
              } else {
                alert(response.error);
              }
            })
            .catch(function(error) {
              alert(error);
            })
            .finally(function() {
              $scope.flags.busy = false;
            });
        } else {
          alert('The passwords do not match.');
        }
      };
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/users.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users', {
          abstract: true,
          templateUrl: 'app/templates/users/users.html'
        });
    }]);


}) (angular.module ('rpg', ['ngResource', 'ui.router']));
angular.module('rpg').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/templates/games/load.html',
    '<div class="d-flex justify-content-center align-items-center" style="height: 100%;"><div class="jumbotron col-6"><p class=lead>Load Game</p><form ng-submit=load()><div class="form-group row"><div class=col-12><ul class="list-group list-group-flush"><li class="list-group-item list-group-item-action" ng-class="{ active: model.gameId == game.id }" ng-click="model.gameId = 1;" ng-repeat="game in games">{{ game.title }}</li></ul></div></div><div class=row><span class=col-5><button class="btn btn-secondary w-100" ng-disabled=flags.busy ng-click="transitionTo(\'users.logout\');" type=reset>Log Out</button> </span><span class="col-5 offset-2"><button class="btn btn-primary w-100" ng-disabled=flags.busy type=submit>Load Game</button></span></div></form></div></div>'
  );


  $templateCache.put('app/templates/users/login.html',
    '<div class="jumbotron col-6"><p class=lead>Log In</p><form ng-submit=login()><label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-user"></i></span></div><input class="form-control col" name=user ng-disabled=flags.busy ng-model=model.user placeholder=Username required/></span></label> <label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-key"></i></span></div><input class=form-control name=pass ng-disabled=flags.busy ng-model=model.pass placeholder=Password required type=password /></span></label><div class=row><span class=col-5><button class="btn btn-secondary w-100" ng-disabled=flags.busy ng-click="transitionTo(\'users.register\');" type=reset>Register</button> </span><span class="col-5 offset-2"><button class="btn btn-primary w-100" ng-disabled=flags.busy type=submit>Log In</button></span></div></form></div>'
  );


  $templateCache.put('app/templates/users/register.html',
    '<div class="jumbotron col-6"><p class=lead>Register</p><form ng-submit=register()><label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-user"></i></span></div><input class="form-control col" name=user ng-disabled=flags.busy ng-model=model.user placeholder=Username required/></span></label> <label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-envelope"></i></span></div><input class="form-control col" name=email ng-disabled=flags.busy ng-model=model.email placeholder=Email required/></span></label> <label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-key"></i></span></div><input autocomplete=new-password name=pass class="form-control col" ng-disabled=flags.busy ng-model=model.pass placeholder=Password required type=password /></span></label> <label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-key"></i></span></div><input autocomplete=new-password name=pass2 class="form-control col" ng-disabled=flags.busy ng-model=model.pass2 placeholder="Password (again)" required type=password /></span></label><div class=row><span class=col-5><button class="btn btn-secondary w-100" ng-disabled=flags.busy ng-click="transitionTo(\'users.login\');" type=reset>Log In</button> </span><span class="col-5 offset-2"><button class="btn btn-primary w-100" ng-disabled=flags.busy type=submit>Register</button></span></div></form></div>'
  );


  $templateCache.put('app/templates/users/users.html',
    '<div class="d-flex justify-content-center align-items-center" style="height: 100%;" ui-view></div>'
  );

}]);
