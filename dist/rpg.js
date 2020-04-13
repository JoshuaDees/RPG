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
        'restrict': 'E',
        'link': function($scope, $element) {
          $timeout(function() {
            $element[0].showModal();
          });
        }
      }
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/directives/overlay.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .directive('overlay', function() {
      return {
        'constrain': 'A',
        'link': function($scope, $element, $attributes) {
          $scope.$watchGroup([
            $attributes.overlay,
            $attributes.overlayText
          ], function(options) {
            $element.find('> .overlay').remove();

            if (options[0]) {
              $element.append('<div class="overlay"><span class="message">' + (options[1] || 'Loading...') + '</span></div>');
            }
          });
        }
      };
    });

//--------------------------------------------------------------------------------------------------------------------
// File: app/filters/modifier.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .filter('modifier', function() {
      return function(modifier) {
        return '' + (modifier > 0 ? '+' : '') + modifier;
      };
    });

//--------------------------------------------------------------------------------------------------------------------
// File: app/providers/error.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('ErrorProvider', function() {
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
    });

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
    .factory('SessionProvider', function() {
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
    });

//--------------------------------------------------------------------------------------------------------------------
// File: app/resources/characters.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('CharactersResource', [
      'RestfulService',
    function(
      RestfulService
    ) {
      return RestfulService('data/characters.php', null, {
        'abilities': {
          'method': 'POST',
          'params': {
            'action': 'abilities'
          }
        },
        'classes': {
          'method': 'POST',
          'params': {
            'action': 'classes'
          }
        },
        'genders': {
          'method': 'POST',
          'params': {
            'action': 'genders'
          }
        },
        'races': {
          'method': 'POST',
          'params': {
            'action': 'races'
          }
        }
      });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/resources/games.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('GamesResource', [
      'RestfulService',
    function(
      RestfulService
    ) {
      return RestfulService('data/games.php', null, {
        'load': {
          'method': 'POST',
          'params': {
            'action': 'load'
          }
        }
      });
    }])

//--------------------------------------------------------------------------------------------------------------------
// File: app/resources/users.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .factory('UsersResource', [
      'RestfulService',
    function(
      RestfulService
    ) {
      return RestfulService('data/users.php', null, {
        'login': {
          'method': 'POST',
          'params': {
            'action': 'login'
          }
        },
        'logout': {
          'method': 'POST',
          'params': {
            'action': 'logout'
          }
        },
        'register': {
          'method': 'POST',
          'params': {
            'action': 'register'
          }
        }
      });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/services/restful.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$qProvider',
      '$resourceProvider',
    function(
      $qProvider,
      $resourceProvider
    ) {
      $qProvider.errorOnUnhandledRejections(false);

      $resourceProvider.defaults.cancellable = true;
    }])
    .service('RestfulService', [
      '$resource',
    function(
      $resource
    ) {
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
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games', {
          'abstract': {},
          'scope': true,
          'template': '<ui-view />',
          'controller': [
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
              'userId': SessionProvider.get('userId')
            };

            $scope.flags = {
              'loading': true
            };

            GamesResource.abort().load($scope.model)
              .then(function(response) {
                if (response.success) {
                  $scope.games = response.model;

                  _.set($scope, 'model.gameId',
                    _.get($scope, 'games[0].id')
                  );
                } else {
                  ErrorProvider.alert(response.message);
                }
              })
              .catch(function(error) {
                ErrorProvider.alert(error);
              })
              .finally(function() {
                _.set($scope, 'flags.loading', false);
              });

            KeyEventProvider.actions = [];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/load.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games.load', {
          'scope': {},
          'templateUrl': 'app/templates/games/load.html',
          'controller': [
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

            KeyEventProvider.actions = [{
              'matches': ['Shift+Escape', 'Escape'],
              'callback': function() {
                $state.transitionTo('games.menu');
              }
            }];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/menu.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games.menu', {
          'scope': {},
          'templateUrl': 'app/templates/games/menu.html',
          'controller': [
            '$scope',
            '$state',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            KeyEventProvider
          ) {
            KeyEventProvider.actions = [{
              'matches': ['l'],
              'callback': function() {
                $state.transitionTo('games.load');
              }
            }, {
              'matches': ['n'],
              'callback': function() {
                $state.transitionTo('games.new.party');
              }
            }];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/abilities.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games.new.character.abilities', {
          'scope': {},
          'templateUrl': 'app/templates/games/new/character/abilities.html',
          'controller': [
            '$scope',
            '$state',
            '$stateParams',
            'CharactersResource',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            $stateParams,
            CharactersResource,
            KeyEventProvider
          ) {
            $scope.model = {
              'selected': {
                'abilities': []
              },
              'details': {
                'bonus': 15
              }
            };

            $scope.flags = {
              'loading': true
            };

            $scope.getValue = function(attribute) {
              return parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].default')) +
                parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].raceModifier') || 0) +
                parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].classModifier') || 0) +
                $scope.getBonus(attribute);
            };

            $scope.getBonus = function(attribute) {
              var bonus;

              if (attribute != undefined) {
                bonus = parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].bonus') || 0);
              } else {
                bonus = parseFloat(_.get($scope, 'model.details.bonus'));

                _.forEach(_.get($scope, 'model.selected.abilities'), function(details, ability) {
                  bonus -= $scope.getBonus(ability);
                });
              }

              return bonus;
            };

            $scope.getModifier = function(attribute) {
              return Math.floor(($scope.getValue(attribute) - 10) / 2);
            };

            $scope.increment = function(attribute, $event) {
              _.set($scope, 'model.selected.abilities[' + attribute + '].bonus',
                parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].bonus') || 0) + 1
              );

              $event.preventDefault();
            };

            $scope.decrement = function(attribute, $event) {
              _.set($scope, 'model.selected.abilities[' + attribute + '].bonus',
                parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].bonus') || 0) - 1
              );

              $event.preventDefault();
            };

            $scope.accept = function() {
              _.invoke($scope.$parent, 'update', _.get($scope, 'model.selected'));
            };

            CharactersResource.abort().abilities({
              'raceId': _.get($scope.$parent, 'model.race.id'),
              'classId': _.get($scope.$parent, 'model.class.id')
            })
              .then(function(response) {
                if (response.success) {
                  _.set($scope, 'model.selected.abilities',
                    _.merge([], response.model, _.get($scope.$parent, 'model.abilities'))
                  );
                } else {
                  ErrorProvider.alert(response.message);
                }
              })
              .catch(function(error) {
                ErrorProvider.alert(error);
              })
              .finally(function() {
                _.set($scope, 'flags.loading', false);
              });

            KeyEventProvider.actions = [{
              'matches': ['Shift+Escape', 'Escape'],
              'callback': function() {
                $state.transitionTo('games.new.character.details', {
                  'model': _.get($scope.$parent, 'model')
                });
              }
            }];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/character.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games.new.character', {
          'abstract': true,
          'scope': {},
          'templateUrl': 'app/templates/games/new/character/character.html',
          'params': {
            'model': null
          },
          'controller': [
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

            $scope.getAttributeValue = function(attribute) {
              return parseFloat(_.get(attribute, 'default')) +
                parseFloat(_.get(attribute, 'raceModifier') || 0) +
                parseFloat(_.get(attribute, 'classModifier') || 0) +
                parseFloat(_.get(attribute, 'bonus') || 0);
            };

            $scope.update = function(attributes) {
              _.forEach(attributes, function(value, property) {
                _.set($scope, 'model.' + property, value);
              });

              $state.transitionTo('games.new.character.details', {
                'model': $scope.model
              });
            };

            KeyEventProvider.actions = [{
              'matches': ['Shift+Escape', 'Escape'],
              'callback': function() {
                $state.transitionTo('games.new.party');
              }
            }];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/class.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games.new.character.class', {
          'scope': {},
          'templateUrl': 'app/templates/games/new/character/class.html',
          'controller': [
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
              'options': {
                'class': []
              },
              'selected': {
                'class': null
              }
            };

            $scope.flags = {
              'loading': true
            };

            $scope.accept = function() {
              _.invoke($scope.$parent, 'update', _.get($scope, 'model.selected'));
            };

            CharactersResource.abort().classes({
              'raceId': _.get($scope.$parent, 'model.race.id')
            })
              .then(function(response) {
                if (response.success) {
                  _.set($scope, 'model.options.class', response.model);

                  _.set($scope, 'model.selected.class', _.filter(
                    _.get($scope, 'model.options.class'),
                    function(current, index) {
                      var selected = _.get($scope.$parent, 'model.class.id');
                      return selected ? current.id == selected : index == 0;
                    }
                  )[0]);
                } else {
                  ErrorProvider.alert(response.message);
                }
              })
              .catch(function(error) {
                ErrorProvider.alert(error);
              })
              .finally(function() {
                _.set($scope, 'flags.loading', false);

                $timeout(function() {
                  $('[type=radio]' + ($('[type=radio][checked]').length ? '[checked]' : '')).first().focus();
                });
              });

            KeyEventProvider.actions = [{
              'matches': ['Shift+Escape', 'Escape'],
              'callback': function() {
                $state.transitionTo('games.new.character.details', {
                  'model': _.get($scope.$parent, 'model')
                });
              }
            }];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/details.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games.new.character.details', {
          'state': {},
          'controller': [
            '$scope',
            '$state',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            KeyEventProvider
          ) {
            KeyEventProvider.actions = [{
              'matches': ['Shift+Escape', 'Escape'],
              'callback': function() {
                $state.transitionTo('games.new.party');
              }
            }, {
              'matches': ['r|c|a|s|n'],
              'callback': function(match) {
                $state.transitionTo('games.new.character.' + ({
                  'r': 'race',
                  'c': 'class',
                  'a': 'abilities',
                  's': 'skills',
                  'n': 'name'
                })[match], {
                  'model': _.get($scope.$parent, 'model')
                });
              }
            }];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/name.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games.new.character.name', {
          'scope': {},
          'templateUrl': 'app/templates/games/new/character/name.html',
          'controller': [
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
              'selected': _.get($scope.$parent, 'model.name')
            };

            $scope.accept = function() {
              _.invoke($scope.$parent, 'update', {
                'name': _.get($scope.model, 'selected')
              });
            };

            KeyEventProvider.actions = [{
              'matches': ['Shift+Escape', 'Escape'],
              'callback': function() {
                $state.transitionTo('games.new.character.details', {
                  'model': _.get($scope.$parent, 'model')
                });
              }
            }];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/character/race.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games.new.character.race', {
          'scope': {},
          'templateUrl': 'app/templates/games/new/character/race.html',
          'controller': [
            '$q',
            '$scope',
            '$state',
            '$stateParams',
            '$timeout',
            'CharactersResource',
            'KeyEventProvider',
          function(
            $q,
            $scope,
            $state,
            $stateParams,
            $timeout,
            CharactersResource,
            KeyEventProvider
          ) {
            $scope.model = {
              'options': {
                'genders': [],
                'races': []
              },
              'selected': {
                'gender': null,
                'race': null
              }
            };

            $scope.flags = {
              'loading': true
            };

            $scope.accept = function() {
              _.invoke($scope.$parent, 'update', _.get($scope, 'model.selected'));
            };

            CharactersResource.abort();

            var promises = {};

            promises.genders = CharactersResource.genders()
              .then(function(response) {
                if (response.success) {
                  _.set($scope, 'model.options.genders', response.model);

                  _.set($scope, 'model.selected.gender', _.filter(
                    _.get($scope, 'model.options.genders'),
                    function(current, index) {
                      var selected = _.get($scope.$parent, 'model.gender.id');
                      return selected ? current.id == selected : index == 0;
                    }
                  )[0]);
                } else {
                  ErrorProvider.alert(response.message);
                }
              })
              .catch(function(error) {
                ErrorProvider.alert(error);
              });

            promises.races = CharactersResource.races()
              .then(function(response) {
                if (response.success) {
                  _.set($scope, 'model.options.races', response.model);

                  _.set($scope, 'model.selected.race', _.filter(
                    _.get($scope, 'model.options.races'),
                    function(current, index) {
                      var selected = _.get($scope.$parent, 'model.race.id');
                      return selected ? current.id == selected : index == 0;
                    }
                  )[0]);
                } else {
                  ErrorProvider.alert(response.message);
                }
              })
              .catch(function(error) {
                ErrorProvider.alert(error);
              });

            $q.all(promises)
              .finally(function() {
                _.set($scope, 'flags.loading', false);

                $timeout(function() {
                  $('[type=radio]' + ($('[type=radio][checked]').length ? '[checked]' : '')).first().focus();
                });
              });

            KeyEventProvider.actions = [{
              'matches': ['Shift+Escape', 'Escape'],
              'callback': function() {
                $state.transitionTo('games.new.character.details', {
                  'model': _.get($scope.$parent, 'model')
                });
              }
            }];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/games/new/new.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games.new', {
          'abstract': true,
          'scope': {},
          'template': '<ui-view />',
          'controller': [
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
              'userId': SessionProvider.get('userId'),
              'characters': [{}, {}, {}, {}, {}, {}]
            };

            $scope.isTeamFull = function() {
              return _.filter(_.get($scope, 'model.characters'), function(character) {
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
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('games.new.party', {
          'scope': {},
          'templateUrl': 'app/templates/games/new/party.html',
          'controller': [
            '$scope',
            '$state',
            'KeyEventProvider',
          function(
            $scope,
            $state,
            KeyEventProvider
          ) {
            KeyEventProvider.actions = [{
              'matches': ['Shift+Escape', 'Escape'],
              'callback': function() {
                $state.transitionTo('games.menu');
              }
            }, {
              'matches': ['1|2|3|4|5|6'],
              'callback': function(match) {
                $state.transitionTo('games.new.character.details', {
                  'model': _get($scope, '$parent.model.characters[' + (match - 1) + ']')
                });
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
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('users.login', {
          'scope': {},
          'templateUrl': 'app/templates/users/login.html',
          'controller': [
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
              'loading': false
            };

            $scope.login = function() {
              _.set($scope, 'flags.loading', true);

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
                  ErrorProvider.alert(error);
                })
                .finally(function() {
                  _.set($scope, 'flags.loading', false);
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
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('users.logout', {
          'scope': {},
          'controller': [
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
                  ErrorProvider.alert(response.message);
                }
              })
              .catch(function(error) {
                ErrorProvider.alert(error);
              });

            KeyEventProvider.actions = [];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/register.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('users.register', {
          'scope': {},
          'templateUrl': 'app/templates/users/register.html',
          'controller': [
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
              'loading': false
            };

            $scope.register = function() {
              if(_.get($scope, 'model.pass') === _.get($scope, 'model.pass2')) {
                _.set($scope, 'flags.loading', true);

                UsersResource.abort().register($scope.model)
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
                    ErrorProvider.alert(error);
                  })
                  .finally(function() {
                    _.set($scope, 'flags.loading', false);
                  });
              } else {
                ErrorProvider.alert('The passwords do not match.');
              }
            };

            KeyEventProvider.actions = [{
                'matches': ['Shift+Escape', 'Escape'],
                'callback': function() {
                  $state.transitionTo('users.login');
                }
              }];
          }]
        });
    }]);

//--------------------------------------------------------------------------------------------------------------------
// File: app/states/users/users.js
//--------------------------------------------------------------------------------------------------------------------

  module
    .config([
      '$stateProvider',
    function(
      $stateProvider
    ) {
      $stateProvider
        .state('users', {
          'abstract': true,
          'scope': {},
          'template': '<ui-view />'
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
    '<dialog modal><form ng-submit="!flags.loading && (getBonus() == 0) && accept()"><header><a ui-sref="games.new.character.details({ model: $parent.model })"><i class="fa fa-times"></i></a> Select Abilities</header><main overlay=flags.loading style="height: 272px; width: 330px;"><div class="row condensed separated"><label class="flex text-right" style="display: inline-block; width: 104px; text-transform: capitalize;">Bonus Points:</label> <input class=text-center disabled ng-value=getBonus() style="width: 64px;"/></div><div class="row condensed separated" ng-repeat="ability in model.selected.abilities track by $index"><label class="flex text-right" style="display: inline-block; width: 96px; text-transform: capitalize;">{{ ability.name }}:</label> <input class=text-center disabled ng-value=getValue($index) style="width: 64px;"/> <input class=text-center disabled ng-value=getModifier($index) style="width: 64px;"/> <button ng-click="increment($index, $event)" ng-disabled="getBonus() == 0" onfocus=this.blur(); style="min-width: 32px;"><i class="fa fa-plus"></i></button> <button ng-click="decrement($index, $event)" ng-disabled="getBonus($index) == 0" onfocus=this.blur(); style="min-width: 32px;"><i class="fa fa-minus"></i></button></div></main><footer><button ng-disabled="flags.loading || (getBonus() != 0)" type=submit>Accept</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/games/new/character/character.html',
    '<h2>Create Character</h2><dialog><form><header><a ui-sref=games.new.party><i class="fa fa-times"></i></a> Create Character</header><main><article style="width: 832px;"><aside><nav class=compact><button ng-disabled="false && !model.gender" onfocus=this.blur(); ng-click="transitionTo(\'games.new.character.race\', { model: model })">Race</button> <button ng-disabled=!model.race onfocus=this.blur(); ng-click="transitionTo(\'games.new.character.class\', { model: model })">Class</button> <button ng-disabled=!model.class onfocus=this.blur(); ng-click="transitionTo(\'games.new.character.abilities\', { model: model })">Abilities</button> <button ng-disabled=!model.abilities onfocus=this.blur(); ng-click="transitionTo(\'games.new.character.skills\', { model: model })">Skills</button> <button ng-disabled=!model.skills onfocus=this.blur(); ng-click="transitionTo(\'games.new.character.name\', { model: model })">Name</button></nav></aside><section class=border><p ng-if=model.name><b>Name:</b> {{ model.name }}</p><p ng-if=model.gender><b>Gender:</b> {{ model.gender.name }}</p><p ng-if=model.race><b>Race:</b> {{ model.race.name }}</p><p ng-if=model.class><b>Class:</b> {{ model.class.name }}</p><p ng-if=model.abilities><b>Abilities:</b> <span ng-repeat="ability in model.abilities track by $index">{{ ability.abbreviation }}: {{ getAttributeValue(ability) }}<span ng-if=!$last>,&nbsp;</span></span></p><p ng-if=model.skills><b>Skills:</b> Bastard Sword, Plate Armor, Shield, Body Building</p></section><aside><figure><img class="portrait large" ng-if="model.race && model.gender" ng-src="./media/images/characters/portraits/{{ model.race.name }}.{{ model.gender.name }}.1.jpg"/> <img class="portrait large" ng-if="!model.race || !model.gender" ng-src=./media/images/transparent.gif /></figure></aside></article></main><footer><button disabled type=submit>Create</button></footer></form></dialog><ui-view/>'
  );


  $templateCache.put('app/templates/games/new/character/class.html',
    '<dialog modal><form ng-submit="!flags.loading && accept()"><header><a ui-sref="games.new.character.details({ model: $parent.model })"><i class="fa fa-times"></i></a> Select Class</header><main overlay=flags.loading><article style="height: 360px; width: 640px;"><aside style="width: 160px;"><ul style="height: 100%;"><li ng-class="{ active: model.selected.class.id == class.id, disabled: class.enabled == null }" ng-repeat="class in model.options.class"><label class=input-checkbox><input name=class ng-checked="model.selected.class.id === class.id" ng-disabled="class.enabled == null" ng-model=model.selected.class ng-value=class type=radio /> {{ class.name }}</label></li></ul></aside><section class=border><p>{{ model.selected.class.description }}</p></section></article></main><footer><button ng-disabled=flags.loading type=submit>Accept</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/games/new/character/name.html',
    '<dialog modal><form ng-submit=accept()><header><a ui-sref="games.new.character.details({ model: $parent.model })"><i class="fa fa-times"></i></a> Select Name</header><main class=row><input class="flex text-center" maxlength=45 ng-model=model.selected placeholder="Character Name"/></main><footer><button type=submit>Accept</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/games/new/character/race.html',
    '<dialog modal><form ng-submit="!loading && accept()"><header><a ui-sref="games.new.character.details({ model: $parent.model })"><i class="fa fa-times"></i></a> Select Race</header><main overlay=flags.loading><article style="height: 360px;"><aside style="width: 160px;"><ul style="height: 100%;"><li ng-class="{ active: model.selected.race.id == race.id }" ng-repeat="race in model.options.races"><label class=input-checkbox><input name=race ng-checked="model.selected.race.id === race.id" ng-model=model.selected.race ng-value=race type=radio /> {{ race.name }}</label></li></ul></aside><section class=border style="width: 480px;"><p>{{ model.selected.race.description }}</p></section><aside style=width:160px;><figure style="display: block; margin: 0 0 16px;"><img class="portrait large" ng-src="./media/images/characters/portraits/{{ model.selected.race.name }}.{{ model.selected.gender.name }}.1.jpg"/></figure><ul><li ng-class="{ active: model.selected.gender.id == gender.id }" ng-repeat="gender in model.options.genders"><label class=input-checkbox><input name=gender ng-checked="model.selected.gender.id === gender.id" ng-model=model.selected.gender ng-value=gender type=radio /> {{ gender.name }}</label></li></ul></aside></article></main><footer><button ng-disabled=flags.loading type=submit>Accept</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/games/new/party.html',
    '<h2>New Game</h2><dialog><form><header><a ui-sref=games.menu><i class="fa fa-times"></i></a> Create Party</header><main><figure ng-repeat="x in [].constructor(6) track by $index"><img class=portrait ng-if-start=$parent.model.characters[$index].name ng-src="./media/images/characters/portraits/{{ $parent.model.characters[$index].race.name }}.{{ $parent.model.characters[$index].gender.name }}.1.jpg"/><figcaption ng-if-end><p><b>{{ $parent.model.characters[$index].name }}</b><br/><small>{{ $parent.model.characters[$index].race.name }} {{ $parent.model.characters[$index].class.name }}</small></p><nav class=compact><button ui-sref="games.new.character.details({ model: $parent.model.characters[$index] })">Edit</button></nav></figcaption><img class=portrait ng-if-start=!$parent.model.characters[$index].name src=./media/images/transparent.gif /><figcaption ng-if-end><p>&nbsp;<br/><small>&nbsp;</small></p><nav class=compact><button ui-sref="games.new.character.details({ model: $parent.model.characters[$index] })">Create</button></nav></figcaption></figure></main><footer><button ng-disabled=!$parent.isTeamFull() type=submit>Start Game</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/users/login.html',
    '<h2>Log In</h2><dialog><form name=loginForm ng-submit=login()><header>Log In</header><main overlay=flags.loading><input style="display: none;"/> <input style="display: none;" type=password /> <label class=input-group><i class="fa fa-user"></i> <input maxlength=45 ng-disabled=flags.loading ng-model=model.user placeholder=Username required/></label> <label class=input-group><i class="fa fa-key"></i> <input maxlength=45 ng-disabled=flags.loading ng-model=model.pass placeholder=Password required type=password /></label><div class="input-helper text-right"><a href=javascript:;>Forgot Password?</a></div></main><footer><button ng-disabled=flags.loading ng-click="transitionTo(\'users.register\');" type=reset>Register</button> <button ng-disabled="flags.loading || loginForm.$invalid" type=submit>Log In</button></footer></form></dialog>'
  );


  $templateCache.put('app/templates/users/register.html',
    '<h2>Register</h2><dialog><form name=registerForm ng-submit=register()><header><a ui-sref=users.login><i class="fa fa-times"></i></a> Register</header><main overlay=flags.loading><input style="display: none;"/> <input style="display: none;" type=password /> <label class=input-group><i class="fa fa-user"></i> <input maxlength=45 ng-disabled=flags.loading ng-model=model.user placeholder=Username required/></label> <label class=input-group><i class="fa fa-envelope"></i> <input maxlength=45 ng-disabled=flags.loading ng-model=model.email placeholder=Email required type=email /></label> <label class=input-group><i class="fa fa-key"></i> <input maxlength=45 ng-disabled=flags.loading ng-model=model.pass placeholder=Password required type=password /></label> <label class=input-group><i class="fa fa-key"></i> <input maxlength=45 ng-disabled=flags.loading ng-model=model.pass2 placeholder="Password (again)" required type=password /></label></main><footer><button ng-disabled="flags.loading || registerForm.$invalid || model.pass !== model.pass2" type=submit>Register</button></footer></form></dialog>'
  );

}]);
