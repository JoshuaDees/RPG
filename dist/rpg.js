//====================================================================================================================
// Module:    rpg
// Optimized: Yes
// File:      app/app.js
//====================================================================================================================

(function (module) {


//--------------------------------------------------------------------------------------------------------------------
// File: app/directives/dialog.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('DialogService', function() {
      $(window).on('resize', function() {
        $('dialog').each(function(index, dialog) {
          dialog.close();
          dialog.showModal();
        })
      });

      return {};
    })
    .directive('dialog', [
      '$timeout',
      'DialogService',
    function(
      $timeout,
      DialogService
    ) {
      return {
        restrict: 'E',
        link: function($scope, $element) {
          $timeout(function() {
            $element[0].showModal();
          });
        }
      }
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/providers/keyEvent.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('KeyEventProvider', function() {

      return new function() {
        this.actions = [];

        this.$handleEvent = function($event) {
          _.forEach(this.actions, function(action) {
            if (stringify($event).match(action.matches)) {
              action.callback($event);
            }
          });

          if (stringify($event).match(/(Shift\+)?Escape/)) {
            $event.preventDefault();
          }
        };

        function stringify($event) {
          return _.compact([
            $event.ctrlKey ? 'Ctrl' : '',
            $event.altKey ? 'Alt' : '',
            $event.shiftKey ? 'Shift' : '',
            (
              ($event.key === 'Control' && $event.ctrlKey) ||
              ($event.key === 'Alt' && $event.altKey) ||
              ($event.key === 'Shift' && $event.shiftKey) ||
              ($event.key === 'Meta' && $event.metaKey)
            ) ? '' : $event.key
          ]).join('+') || '';
        }

        var KeyEventProvider = this;

        $(document).on('keydown keyup keypress', function($event) {
          KeyEventProvider.$handleEvent($event);
        });
      }();
    });

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
      return RestfulService('data/games.php', null, {
        load: {
          method: 'POST',
          params: { action: 'load' }
        }
      });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/resources/users.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('UsersResource', ['RestfulService', function(RestfulService) {
      return RestfulService('data/users.php', null, {
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
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/services/restful.js
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
// File: app/states/games/games.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games', {
          abstract: true,
          controller: 'GamesController',
          template: '<ui-view />'
        });
    }])
    .controller('GamesController', [
      '$scope',
      'GamesResource',
      'SessionProvider',
    function(
      $scope,
      GamesResource,
      SessionProvider
    ) {
      $scope.model = {
        userId: SessionProvider.get('userId')
      };

      $scope.flags = {
        busy: true
      };

      GamesResource.abort().load($scope.model)
        .then(function(response) {
          if (response.success) {
            $scope.games = response.model;

            if (_.get($scope, 'games[0]')) {
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
      'KeyEventProvider',
      'SessionProvider',
    function(
      $scope,
      $state,
      GamesResource,
      KeyEventProvider,
      SessionProvider
    ) {
      $scope.load = function() {
        // TODO:
      };

      KeyEventProvider.actions = [
        {
          matches: /(Shift\+)?Escape/,
          callback: function() { $state.transitionTo('games.nav'); }
        }
      ];
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/nav.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.nav', {
          controller: 'GamesNavController',
          templateUrl: 'app/templates/games/nav.html'
        });
    }])
    .controller('GamesNavController', [
      '$scope',
      'KeyEventProvider',
    function(
      $scope,
      KeyEventProvider
    ) {
      KeyEventProvider.actions = [];
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/new.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.new', {
          abstract: true,
          controller: 'NewGameController',
          template: '<ui-view />'
        });
    }])
    .controller('NewGameController', [
      '$scope',
      '$state',
      'KeyEventProvider',
      'SessionProvider',
    function(
      $scope,
      $state,
      KeyEventProvider,
      SessionProvider
    ) {
      $scope.model = {
        userId: SessionProvider.get('userId'),
        characters: [{
          name: 'Crag Hack',
          race: { name: 'Half-Orc' },
          'class': { name: 'Knight' },
          gender: { name: 'Male' }
        }, {
          name: 'Sir Galland',
          race: { name: 'Dwarf' },
          'class': { name: 'Paladin' },
          gender: { name: 'Male' }
        }, {
          name: 'Sure Valla',
          race: { name: 'Half-Elf' },
          'class': { name: 'Archer' },
          gender: { name: 'Female' }
        }, {
          name: 'Swifty Sarg',
          race: { name: 'Gnome' },
          'class': { name: 'Robber' },
          gender: { name: 'Male' }
        }, {
          name: 'Serena',
          race: { name: 'Human' },
          'class': { name: 'Cleric' },
          gender: { name: 'Female' }
        }, {
          name: 'Wizz Bane',
          race: { name: 'Elf' },
          'class': { name: 'Sorcerer' },
          gender: { name: 'Male' }
        }]
      };

      $scope.isTeamFull = function() {
        return _.compact($scope.model.characters).length === 6;
      };
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/party.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.new.party', {
          controller: 'GamesNewPartyController',
          templateUrl: 'app/templates/games/new/party.html'
        });
    }])
    .controller('GamesNewPartyController', [
      '$state',
      'KeyEventProvider',
    function(
      $state,
      KeyEventProvider
    ) {
      KeyEventProvider.actions = [
        {
          matches: /(Shift\+)?Escape/,
          callback: function() { $state.transitionTo('games.nav'); }
        }
      ];
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/rpg.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .controller('RPGController', [
      '$scope',
      '$state',
      'KeyEventProvider',
      'SessionProvider',
    function(
      $scope,
      $state,
      KeyEventProvider,
      SessionProvider
    ) {
      if (SessionProvider.get('userId')) {
        $state.transitionTo('games.nav');
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
              SessionProvider.set('userName', response.model.name);

              $state.transitionTo('games.nav');
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
      'KeyEventProvider',
      'SessionProvider',
      'UsersResource',
    function(
      $scope,
      $state,
      KeyEventProvider,
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
                SessionProvider.set('userName', response.model.name);

                $state.transitionTo('games.nav');
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

      KeyEventProvider.actions = [
        {
          matches: /(Shift\+)?Escape/,
          callback: function() { $state.transitionTo('users.login'); }
        }
      ];
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

  $templateCache.put('app/templates/games/load.html',
    '<dialog><form ng-submit=load()><header><a ui-sref=games.nav><i class="fa fa-times"></i></a> Load Game</header><main><ul style="height: 160px;"><li ng-class="{ active: $parent.model.gameId == game.id }" ng-repeat="game in $parent.games"><label class=input-checkbox><input ng-model=$parent.model.gameId ng-value=game.id type=radio /> {{ game.title }}</label></li></ul></main><footer><button ng-disabled="flags.busy || !$parent.model.gameId" type=submit>Load Game</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/games/nav.html',
    '<dialog class=transparent><main><nav><button ng-click="transitionTo(\'games.load\');" ng-disabled=!$parent.model.gameId type=submit>Load Game</button> <button ng-click="transitionTo(\'games.new.party\')" type=submit>New Game</button> <button disabled type=submit>Help</button> <button ng-click="transitionTo(\'users.logout\');" type=submit>Log Out</button></nav></main></dialog>'
  );


  $templateCache.put('app/templates/games/new/party.html',
    '<dialog><header><a ui-sref=games.nav><i class="fa fa-times"></i></a> Create Party</header><main><figure ng-repeat="x in [].constructor(6) track by $index"><img class=portrait ng-if-start=$parent.model.characters[$index] ng-src="./media/images/characters/portraits/{{ $parent.model.characters[$index].race.name }}.{{ $parent.model.characters[$index].gender.name }}.1.jpg"/><figcaption ng-if-end><p><b>{{ $parent.model.characters[$index].name }}</b><br/>{{ $parent.model.characters[$index].race.name }} {{ $parent.model.characters[$index].class.name }}</p><nav class=compact><button disabled>Edit</button></nav></figcaption><img class=portrait ng-if-start=!$parent.model.characters[$index] src=./media/images/transparent.gif /><figcaption ng-if-end><p>No Character<br/>Created</p><nav class=compact><button disabled>Create</button></nav></figcaption></figure></main><footer><button ng-disabled=!$parent.isTeamFull() type=submit>Start Game</button></footer></dialog>'
  );


  $templateCache.put('app/templates/users/login.html',
    '<dialog><form name=loginForm ng-submit=login()><header>Log In</header><main><input style="display: none;"/> <input style="display: none;" type=password /> <label class=input-group><i class="fa fa-user"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.user placeholder=Username required/></label> <label class=input-group><i class="fa fa-key"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.pass placeholder=Password required type=password /></label></main><footer><button ng-disabled=flags.busy ng-click="transitionTo(\'users.register\');" type=reset>Register</button> <button ng-disabled="flags.busy || loginForm.$invalid" type=submit>Log In</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/users/register.html',
    '<dialog><form name=registerForm ng-submit=register()><header><a ui-sref=users.login><i class="fa fa-times"></i></a> Register</header><main><input style="display: none;"/> <input style="display: none;" type=password /> <label class=input-group><i class="fa fa-user"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.user placeholder=Username required/></label> <label class=input-group><i class="fa fa-envelope"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.email placeholder=Email required type=email /></label> <label class=input-group><i class="fa fa-key"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.pass placeholder=Password required type=password /></label> <label class=input-group><i class="fa fa-key"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.pass2 placeholder="Password (again)" required type=password /></label></main><footer><button ng-disabled="flags.busy || registerForm.$invalid || model.pass !== model.pass2" type=submit>Register</button></footer></form></dialog>'
  );

}]);
