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
          templateUrl: 'templates/users/load.html'
        });
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
      $scope.model = { user: 'anubis', pass: 'munky1483' };
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
// File: app/states/users/users.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users', {
          abstract: true,
          template: '<ui-view />'
        });
    }]);


}) (angular.module ('rpg', ['ngResource', 'ui.router']));
angular.module('rpg').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/users/load.html',
    'Load Game <button ng-click="transitionTo(\'users.logout\');">Log Out</button>'
  );


  $templateCache.put('templates/users/login.html',
    '<form ng-submit=login()><fieldset><legend>Log In</legend><label><span>Username:</span> <input ng-disabled=flags.busy ng-model=model.user placeholder=Username required/></label> <label><span>Password:</span> <input ng-disabled=flags.busy ng-model=model.pass placeholder=Password required type=password /></label> <button type=submit ng-disabled=flags.busy>Log In</button></fieldset></form>'
  );

}]);
