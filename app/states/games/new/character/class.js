angular
  .module('rpg')
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
