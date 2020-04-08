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
// File: app/resources/users.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('UsersResource', ['RestfulService', function(RestfulService) {
      var url = 'rest/users.php';

      var resource = RestfulService(url, null, {
        login: {
          method: 'POST',
          params: { action: 'login' }
        },
        logout: {},
        register: {}
      });

      return resource;
    }])

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
        $state.transitionTo('users.load');
      } else {
        $state.transitionTo('users.login');
      }

      $scope.transitionTo = function(state) {
        $state.transitionTo(state);
      };
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/load.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users.load', {
          controller: 'LoadController',
          templateUrl: 'templates/users/load.html'
        });
    }])
    .controller('LoadController', [
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
      $scope.model = {
        gameId: 1,
        userId: SessionProvider.get('userId')
      };

      $scope.load = function() {
        // TODO:
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
          templateUrl: 'templates/users/login.html'
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
      $scope.flags = { busy: false };

      $scope.login = function() {
        $scope.flags.busy = true;

        UsersResource.abort().login($scope.model)
          .then(function(response) {
            if (response.success) {
              SessionProvider.set('userId', response.id);

              $state.transitionTo('users.load');
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
    function(
      $state,
      SessionProvider
    ) {
      SessionProvider.remove('userId');

      $state.transitionTo('users.login');
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/register.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users.register', {
          templateUrl: 'templates/users/register.html'
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
        $scope.register = function() {
          // TODO:
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
          templateUrl: 'templates/users/users.html'
        });
    }]);


}) (angular.module ('rpg', ['ngResource', 'ui.router']));
angular.module('rpg').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/users/load.html',
    '<div class="jumbotron col-6"><p class=lead>Load Game</p><form ng-submit=load()><div class="form-group row"><div class=col-12><ul class="list-group list-group-flush"><li class="list-group-item list-group-item-action" ng-class="{ active: model.gameId == 1 }" ng-click="model.gameId = 1;">First Game</li><li class="list-group-item list-group-item-action" ng-class="{ active: model.gameId == 2 }" ng-click="model.gameId = 2;">Second Game</li><li class="list-group-item list-group-item-action" ng-class="{ active: model.gameId == 3 }" ng-click="model.gameId = 3;">Third Game</li></ul></div></div><div class=row><span class=col-5><button class="btn btn-secondary w-100" ng-disabled=flags.busy ng-click="transitionTo(\'users.logout\');" type=reset>Log Out</button> </span><span class="col-5 offset-2"><button class="btn btn-primary w-100" ng-disabled=flags.busy type=submit>Load Game</button></span></div></form></div>'
  );


  $templateCache.put('templates/users/login.html',
    '<div class="jumbotron col-6"><p class=lead>Log In</p><form ng-submit=login()><label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-user"></i></span></div><input class="form-control col" name=user ng-disabled=flags.busy ng-model=model.user placeholder=Username required/></span></label> <label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-key"></i></span></div><input class=form-control name=pass ng-disabled=flags.busy ng-model=model.pass placeholder=Password required type=password /></span></label><div class=row><span class=col-5><button class="btn btn-secondary w-100" ng-disabled=flags.busy ng-click="transitionTo(\'users.register\');" type=reset>Register</button> </span><span class="col-5 offset-2"><button class="btn btn-primary w-100" ng-disabled=flags.busy type=submit>Log In</button></span></div></form></div>'
  );


  $templateCache.put('templates/users/register.html',
    '<div class="jumbotron col-6"><p class=lead>Register</p><form ng-submit=register()><label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-user"></i></span></div><input class="form-control col" name=user ng-disabled=flags.busy ng-model=model.user placeholder=Username required/></span></label> <label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-envelope"></i></span></div><input class="form-control col" name=email ng-disabled=flags.busy ng-model=model.email placeholder=Email required/></span></label> <label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-key"></i></span></div><input autocomplete=new-password name=pass class="form-control col" ng-disabled=flags.busy ng-model=model.pass placeholder=Password required type=password /></span></label> <label class="form-group row"><span class="col-12 input-group"><div class=input-group-prepend><span class=input-group-text><i class="fa fa-key"></i></span></div><input autocomplete=new-password name=pass2 class="form-control col" ng-disabled=flags.busy ng-model=model.pass2 placeholder="Password (again)" required type=password /></span></label><div class=row><span class=col-5><button class="btn btn-secondary w-100" ng-disabled=flags.busy ng-click="transitionTo(\'users.login\');" type=reset>Log In</button> </span><span class="col-5 offset-2"><button class="btn btn-primary w-100" ng-disabled=flags.busy type=submit>Register</button></span></div></form></div>'
  );


  $templateCache.put('templates/users/users.html',
    '<div class="d-flex justify-content-center align-items-center" style="height: 100%;" ui-view></div>'
  );

}]);
