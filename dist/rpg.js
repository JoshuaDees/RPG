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
// File: app/providers/error.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('ErrorProvider', [function() {
      return new function() {
        this.alert = function(error) {
          $(document.body).append(
            '<dialog modal id="error">' +
              '<header>' +
                '<a onclick="$(\'#error\').remove();" ui-sref><i class="fa fa-times"></i></a>' +
                'Error' +
              '</header>' +
              '<main>' + error + '</main>' +
              '<footer><button onclick="$(\'#error\').remove();" type="submit">Close</button></footer>' +
            '</dialog>'
          );

          $('#error')[0].showModal();
        };
      }
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/providers/keyEvent.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('KeyEventProvider', function() {

      return new function() {
        this.actions = [];

        this.$handleEvent = function($event) {
          var str, match;

          _.forEach(this.actions, function(action) {
            _.forEach(action.matches, function(regex) {
              str = stringify($event);
              match = str.match(new RegExp('^' + regex + '$'))

              if (match && match[0] && str == match[0]) {
                action.callback(match[0]);
              }
            })
          });

          if (stringify($event).match(/(Shift\+)?Escape/)) {
            $('#error').remove();

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

        $(document).on('keydown', function($event) {
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
// File: app/resources/characters.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('CharactersResource', ['RestfulService', function(RestfulService) {
      return RestfulService('data/characters.php', null, {
        classes: {
          method: 'POST',
          params: { action: 'classes' }
        },
        genders: {
          method: 'POST',
          params: { action: 'genders' }
        },
        races: {
          method: 'POST',
          params: { action: 'races' }
        }
      });
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
          abstract: {},
          scope: true,
          template: '<ui-view />',
          controller: [
            '$scope',
            'GamesResource',
            'KeyEventProvider',
            'SessionProvider',
          function(
            $scope,
            GamesResource,
            KeyEventProvider,
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

            KeyEventProvider.actions = [];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/load.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.load', {
          scope: {},
          templateUrl: 'app/templates/games/load.html',
          controller: [
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

              matches: ['Shift+Escape', 'Escape'],
            KeyEventProvider.actions = [
              {
                matches: ['Shift+Escape', 'Escape'],
                callback: function() { $state.transitionTo('games.menu'); }
              }
            ];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/menu.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.menu', {
          scope: {},
          templateUrl: 'app/templates/games/menu.html',
          controller: [
            '$scope',
            '$state',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            KeyEventProvider
          ) {
            KeyEventProvider.actions = [
              {
                matches: ['l'],
                callback: function() { $state.transitionTo('games.load'); }
              },
              {
                matches: ['n'],
                callback: function() { $state.transitionTo('games.new.party'); }
              }
            ];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/abilities.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.new.character.abilities', {
          scope: {},
          templateUrl: 'app/templates/games/new/character/abilities.html',
          controller: [
            '$scope',
            '$state',
            '$stateParams',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            $stateParams,
            KeyEventProvider
          ) {
            $scope.model = {
              selected: {
                might: 15,
                intellect: 7,
                personality: 14,
                endurance: 11,
                accuracy: 11,
                speed: 9
              }
            };

            $scope.getModifier = function(attribute) {
              var modifier = Math.floor(($scope.model.selected[attribute] - 10) / 2);

              if (modifier > 0) {
                modifier = '+' + modifier;
              }

              return modifier;
            };

            $scope.accept = function() {
              $scope.$parent.update({
                'abilities': $scope.model.selected
              });
            };

            KeyEventProvider.actions = [
              {
                matches: ['Shift+Escape', 'Escape'],
                callback: function() {
                  $state.transitionTo('games.new.character.details', { model: $scope.$parent.model });
                }
              }
            ];
          }]
        });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/character.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.new.character', {
          abstract: true,
          scope: {},
          templateUrl: 'app/templates/games/new/character/character.html',
          params: {
            model: null
          },
          controller: [
            '$scope',
            '$state',
            '$stateParams',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            $stateParams,
            KeyEventProvider
          ) {
            $scope.model = $stateParams.model || {};

            KeyEventProvider.actions = [{
              matches: ['Shift+Escape', 'Escape'],
              callback: function() { $state.transitionTo('games.new.party'); }
            }];

            $scope.update = function(attributes) {
              _.forEach(attributes, function(value, property) {
                _.set($scope, 'model.' + property, value);
              });

              $state.transitionTo('games.new.character.details', { model: $scope.model });
            };

            /*_.forEach(['race', 'class', 'attributes', 'skills', 'name'], function(attribute) {
              if (!_.get($scope, 'model.' + attribute)) {
                $state.transitionTo('games.new.character.' + attribute, { model: $scope.model });

                return false;
              }
            });*/
          }]
        });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/class.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.new.character.class', {
          scope: {},
          templateUrl: 'app/templates/games/new/character/class.html',
          controller: [
            '$scope',
            '$state',
            '$stateParams',
            '$timeout',
            'CharactersResource',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            $stateParams,
            $timeout,
            CharactersResource,
            KeyEventProvider
          ) {
            $scope.model = {
              items: [],
              selected: null
            };

            $scope.flags = {
              busy: true
            };

            $scope.accept = function() {
              $scope.$parent.update({
                'class': $scope.model.selected
              });
            };

            CharactersResource.abort().classes({
              raceId: _.get($scope.$parent, 'model.race.id')
            })
              .then(function(response) {
                if (response.success) {
                  $scope.model.items = response.model;

                  $scope.model.selected = _.filter($scope.model.items, function(current, index) {
                    var selected = _.get($scope.$parent, 'model.class.id');
                    return selected ? current.id == selected : index == 0;
                  })[0];

                  $timeout(function() {
                    $('[type=radio]' + ($('[type=radio][checked]').length ? '[checked]' : '')).first().focus();
                  });
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

            KeyEventProvider.actions = [
              {
                matches: ['Shift+Escape', 'Escape'],
                callback: function() {
                  $state.transitionTo('games.new.character.details', { model: $scope.$parent.model });
                }
              }
            ];
          }]
        });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/details.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.new.character.details', {
          state: {},
          controller: [
            '$scope',
            '$state',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            KeyEventProvider
          ) {
            KeyEventProvider.actions = [{
              matches: ['Shift+Escape', 'Escape'],
              callback: function() {
                $state.transitionTo('games.new.party');
              }
            }, {
              matches: ['r|c|a|s|n'],
              callback: function(match) {
                $state.transitionTo('games.new.character.' + ({
                  r: 'race',
                  c: 'class',
                  a: 'abilities',
                  s: 'skills',
                  n: 'name'
                })[match], { model: $scope.$parent.model });
              }
            }];
          }]
        });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/name.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.new.character.name', {
          scope: {},
          templateUrl: 'app/templates/games/new/character/name.html',
          controller: [
            '$scope',
            '$state',
            '$stateParams',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            $stateParams,
            KeyEventProvider
          ) {
            $scope.model = {
              selected: _.get($scope.$parent, 'model.name')
            };

            $scope.accept = function() {
              $scope.$parent.update({
                'name': $scope.model.selected
              });
            };

            KeyEventProvider.actions = [
              {
                matches: ['Shift+Escape', 'Escape'],
                callback: function() {
                  $state.transitionTo('games.new.character.details', { model: $scope.$parent.model });
                }
              }
            ];
          }]
        });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/race.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.new.character.race', {
          scope: {},
          templateUrl: 'app/templates/games/new/character/race.html',
          controller: [
            '$scope',
            '$state',
            '$stateParams',
            '$timeout',
            'CharactersResource',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            $stateParams,
            $timeout,
            CharactersResource,
            KeyEventProvider
          ) {
            $scope.model = {
              options: {
                genders: null,
                races: null
              },
              selected: {
                gender: null,
                race: null
              }
            };

            $scope.flags = {
              busy: true
            };

            $scope.accept = function() {
              $scope.$parent.update($scope.model.selected);
            };

            CharactersResource.abort();

            CharactersResource.genders()
              .then(function(response) {
                if (response.success) {
                  $scope.model.options.genders = response.model;

                  $scope.model.selected.gender = _.filter($scope.model.options.genders, function(current, index) {
                    var selected = _.get($scope.$parent, 'model.gender.id');
                    return selected ? current.id == selected : index == 0;
                  })[0];
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

            CharactersResource.races()
              .then(function(response) {
                if (response.success) {
                  $scope.model.options.races = response.model;

                  $scope.model.selected.race = _.filter($scope.model.options.races, function(current, index) {
                    var selected = _.get($scope.$parent, 'model.race.id');
                    return selected ? current.id == selected : index == 0;
                  })[0];
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

            KeyEventProvider.actions = [
              {
                matches: ['Shift+Escape', 'Escape'],
                callback: function() {
                  $state.transitionTo('games.new.character.details', { model: $scope.$parent.model });
                }
              }
            ];
          }]
        });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/new.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.new', {
          abstract: true,
          scope: {},
          template: '<ui-view />',
          controller: [
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
                gender: { id: 1, name: 'Male' },
                race: { id: 6, name: 'Half-Orc' },
                class: { id: 1, name: 'Barbarian' },
                portrait: 'half-orc.male.1',
                abilities: {
                  might: 15,
                  intellect: 7,
                  personality: 9,
                  endurance: 13,
                  accuracy: 9,
                  speed: 11
                },
                skills: []
              }, {}, {}, {}, {}, {}]
            };

            $scope.isTeamFull = function() {
              return _.filter($scope.model.characters, function(character) {
                return character.name;
              }).length === 6;
            };

            KeyEventProvider.actions = [];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/party.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('games.new.party', {
          scope: {},
          templateUrl: 'app/templates/games/new/party.html',
          controller: [
            '$scope',
            '$state',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            KeyEventProvider
          ) {
            KeyEventProvider.actions = [{
              matches: ['Shift+Escape', 'Escape'],
              callback: function() { $state.transitionTo('games.menu'); }
            }, {
              matches: ['1|2|3|4|5|6'],
              callback: function(match) {
                $state.transitionTo('games.new.character.details', { model: $scope.$parent.model.characters[match - 1] });
              }
            }];
          }]
        });
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
        $state.transitionTo('games.menu');
      } else {
        $state.transitionTo('users.login');
      }

      $scope.transitionTo = function(state, params) {
        $state.transitionTo(state, params);
      };
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/login.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users.login', {
          scope: {},
          templateUrl: 'app/templates/users/login.html',
          controller: [
            '$scope',
            '$state',
            'ErrorProvider',
            'KeyEventProvider',
            'SessionProvider',
            'UsersResource',
          function(
            $scope,
            $state,
            ErrorProvider,
            KeyEventProvider,
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

                    $state.transitionTo('games.menu');
                  } else {
                    ErrorProvider.alert(response.error);
                  }
                })
                .catch(function(error) {
                  alert(error);
                })
                .finally(function() {
                  $scope.flags.busy = false;
                });

              KeyEventProvider.actions = [];
            };
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/logout.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users.logout', {
          scope: {},
          controller: [
            '$state',
            'KeyEventProvider',
            'SessionProvider',
            'UsersResource',
          function(
            $state,
            KeyEventProvider,
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
              });

            KeyEventProvider.actions = [];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/register.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users.register', {
          scope: {},
          templateUrl: 'app/templates/users/register.html',
          controller: [
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

                      $state.transitionTo('games.menu');
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
                matches: ['Shift+Escape', 'Escape'],
                callback: function() { $state.transitionTo('users.login'); }
              }
            ];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/users.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider
        .state('users', {
          abstract: true,
          scope: {},
          template: '<ui-view />'
        });
    }]);


}) (angular.module ('rpg', ['ngResource', 'ui.router']));
angular.module('rpg').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/templates/games/load.html',
    '<h2>Load Game</h2><dialog><form ng-submit=load()><header><a ui-sref=games.menu><i class="fa fa-times"></i></a> Load Game</header><main><ul style="height: 160px;"><li ng-class="{ active: $parent.model.gameId == game.id }" ng-repeat="game in $parent.games"><label class=input-checkbox><input name=game ng-model=$parent.model.gameId ng-value=game.id type=radio /> {{ game.title }}</label></li></ul></main><footer><button ng-disabled="flags.busy || !$parent.model.gameId" type=submit>Load Game</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/games/menu.html',
    '<h2>Menu</h2><dialog class=transparent><nav><button ng-click="transitionTo(\'games.load\');" ng-disabled=!$parent.model.gameId type=submit>Load Game</button> <button ng-click="transitionTo(\'games.new.party\')" type=submit>New Game</button> <button disabled>Options</button> <button disabled>Help</button> <button ng-click="transitionTo(\'users.logout\');" type=submit>Log Out</button></nav></dialog>'
  );


  $templateCache.put('app/templates/games/new/character/abilities.html',
    '<dialog modal><form ng-submit=accept()><header><a ui-sref="games.new.character.details({ model: $parent.model })"><i class="fa fa-times"></i></a> Select Abilities</header><main><div ng-repeat="ability in [\'might\', \'intellect\', \'personality\', \'endurance\', \'accuracy\', \'speed\']"><label class=text-right style="display: inline-block; width: 96px; text-transform: capitalize;">{{ ability }}:</label> <input class=text-center disabled ng-model=model.selected[ability] style="width: 64px;"/> <input class=text-center disabled ng-value=getModifier(ability) style="width: 64px;"/> <button style="min-width: 32px;"><i class="fa fa-plus"></i></button> <button style="min-width: 32px;"><i class="fa fa-minus"></i></button></div></main><footer><button type=submit>Accept</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/games/new/character/character.html',
    '<h2>Create Character</h2><dialog><form><header><a ui-sref=games.new.party><i class="fa fa-times"></i></a> Create Character</header><main><article style="width: 832px;"><aside><nav class=compact><button ng-disabled="false && !model.gender" onfocus=this.blur(); ng-click="transitionTo(\'games.new.character.race\', { model: model })">Race</button> <button ng-disabled=!model.race onfocus=this.blur(); ng-click="transitionTo(\'games.new.character.class\', { model: model })">Class</button> <button ng-disabled=!model.class onfocus=this.blur(); ng-click="transitionTo(\'games.new.character.abilities\', { model: model })">Abilities</button> <button ng-disabled=!model.abilities onfocus=this.blur(); ng-click="transitionTo(\'games.new.character.skills\', { model: model })">Skills</button> <button ng-disabled=!model.skills onfocus=this.blur(); ng-click="transitionTo(\'games.new.character.name\', { model: model })">Name</button></nav></aside><section class=border><p ng-if=model.name><b>Name:</b> {{ model.name }}</p><p ng-if=model.gender><b>Gender:</b> {{ model.gender.name }}</p><p ng-if=model.race><b>Race:</b> {{ model.race.name }}</p><p ng-if=model.class><b>Class:</b> {{ model.class.name }}</p><p ng-if=model.abilities><b>Abilities:</b> Mgt: {{ model.abilities.might }}, Int: {{ model.abilities.intellect }}, Per: {{ model.abilities.personality }}, End: {{ model.abilities.endurance }}, Acc: {{ model.abilities.accuracy }}, Spd: {{ model.abilities.speed }}</p><p ng-if=model.skills><b>Skills:</b> Bastard Sword, Plate Armor, Shield, Body Building</p></section><aside><figure><img class="portrait large" ng-if="model.race && model.gender" ng-src="./media/images/characters/portraits/{{ model.race.name }}.{{ model.gender.name }}.1.jpg"/> <img class="portrait large" ng-if="!model.race || !model.gender" ng-src=./media/images/transparent.gif /></figure></aside></article></main><footer><button disabled type=submit>Create</button></footer></form></dialog><ui-view/>'
  );


  $templateCache.put('app/templates/games/new/character/class.html',
    '<dialog modal><form ng-submit=accept()><header><a ui-sref="games.new.character.details({ model: $parent.model })"><i class="fa fa-times"></i></a> Select Class</header><main><article style="height: 360px; width: 640px;"><aside style="width: 160px;"><ul style="height: 100%;"><li ng-class="{ active: model.selected == item, disabled: item.enabled == null }" ng-repeat="item in model.items"><label class=input-checkbox><input name=class ng-disabled="item.enabled == null" ng-model=model.selected ng-value=item type=radio /> {{ item.name }}</label></li></ul></aside><section class=border><p>{{ model.selected.description }}</p></section></article></main><footer><button type=submit>Accept</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/games/new/character/name.html',
    '<dialog modal><form ng-submit=accept()><header><a ui-sref="games.new.character.details({ model: $parent.model })"><i class="fa fa-times"></i></a> Select Name</header><main class=row><input class="flex text-center" maxlength=45 ng-model=model.selected placeholder="Character Name"/></main><footer><button type=submit>Accept</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/games/new/character/race.html',
    '<dialog modal><form ng-submit=accept()><header><a ui-sref="games.new.character.details({ model: $parent.model })"><i class="fa fa-times"></i></a> Select Race</header><main><article style="height: 360px;"><aside style="width: 160px;"><ul style="height: 100%;"><li ng-class="{ active: model.selected.race.id == race.id }" ng-repeat="race in model.options.races"><label class=input-checkbox><input name=race ng-checked="model.selected.race.id === race.id" ng-model=model.selected.race ng-value=race type=radio /> {{ race.name }}</label></li></ul></aside><section class=border style="width: 480px;"><p>{{ model.selected.race.description }}</p></section><aside style=width:160px;><figure style="display: block; margin: 0 0 16px;"><img class="portrait large" ng-src="./media/images/characters/portraits/{{ model.selected.race.name }}.{{ model.selected.gender.name }}.1.jpg"/></figure><ul><li ng-class="{ active: model.selected.gender.id == gender.id }" ng-repeat="gender in model.options.genders"><label class=input-checkbox><input name=gender ng-checked="model.selected.gender.id === gender.id" ng-model=model.selected.gender ng-value=gender type=radio /> {{ gender.name }}</label></li></ul></aside></article></main><footer><button type=submit>Accept</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/games/new/party.html',
    '<h2>New Game</h2><dialog><form><header><a ui-sref=games.menu><i class="fa fa-times"></i></a> Create Party</header><main><figure ng-repeat="x in [].constructor(6) track by $index"><img class=portrait ng-if-start=$parent.model.characters[$index].name ng-src="./media/images/characters/portraits/{{ $parent.model.characters[$index].race.name }}.{{ $parent.model.characters[$index].gender.name }}.1.jpg"/><figcaption ng-if-end><p><b>{{ $parent.model.characters[$index].name }}</b><br/><small>{{ $parent.model.characters[$index].race.name }} {{ $parent.model.characters[$index].class.name }}</small></p><nav class=compact><button ui-sref="games.new.character.details({ model: $parent.model.characters[$index] })">Edit</button></nav></figcaption><img class=portrait ng-if-start=!$parent.model.characters[$index].name src=./media/images/transparent.gif /><figcaption ng-if-end><p>&nbsp;<br/><small>&nbsp;</small></p><nav class=compact><button ui-sref="games.new.character.details({ model: $parent.model.characters[$index] })">Create</button></nav></figcaption></figure></main><footer><button ng-disabled=!$parent.isTeamFull() type=submit>Start Game</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/users/login.html',
    '<h2>Log In</h2><dialog><form name=loginForm ng-submit=login()><header>Log In</header><main><input style="display: none;"/> <input style="display: none;" type=password /> <label class=input-group><i class="fa fa-user"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.user placeholder=Username required/></label> <label class=input-group><i class="fa fa-key"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.pass placeholder=Password required type=password /></label><div class="input-helper text-right"><a href=javascript:;>Forgot Password?</a></div></main><footer><button ng-disabled=flags.busy ng-click="transitionTo(\'users.register\');" type=reset>Register</button> <button ng-disabled="flags.busy || loginForm.$invalid" type=submit>Log In</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/users/register.html',
    '<h2>Register</h2><dialog><form name=registerForm ng-submit=register()><header><a ui-sref=users.login><i class="fa fa-times"></i></a> Register</header><main><input style="display: none;"/> <input style="display: none;" type=password /> <label class=input-group><i class="fa fa-user"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.user placeholder=Username required/></label> <label class=input-group><i class="fa fa-envelope"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.email placeholder=Email required type=email /></label> <label class=input-group><i class="fa fa-key"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.pass placeholder=Password required type=password /></label> <label class=input-group><i class="fa fa-key"></i> <input maxlength=45 ng-disabled=flags.busy ng-model=model.pass2 placeholder="Password (again)" required type=password /></label></main><footer><button ng-disabled="flags.busy || registerForm.$invalid || model.pass !== model.pass2" type=submit>Register</button></footer></form></dialog>'
  );

}]);
