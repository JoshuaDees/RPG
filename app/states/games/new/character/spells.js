angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new.character.spells', {
        'scope': {},
        'templateUrl': 'app/templates/games/new/character/spells.html',
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
          $scope.$parent.step = 'spells';

          $scope.model = {
            'selected': {
              'spells': []
            },
            'details': {
              'points': 1
            }
          };

          $scope.flags = {
            'loading': true
          };

          $scope.getPointsLeft = function() {
            return _.get($scope, 'model.details.points') -
              _.filter(_.get($scope, 'model.selected.spells'), function(spell) {
                return spell.SpellSelected == true;
              }).length;
          };

          $scope.accept = function() {
            _.invoke($scope.$parent, 'update', _.get($scope, 'model.selected'), 'name');
          };

          $scope.back = function() {
            $state.transitionTo('games.new.character.skills', {
              'model': _.get($scope.$parent, 'model')
            });
          };

          CharactersResource.abort().spells({
            'raceId': _.get($scope.$parent, 'model.race.RaceId'),
            'classId': _.get($scope.$parent, 'model.class.ClassId'),
            'specialityId': _.get($scope.$parent, 'model.speciality.SpecialityId')
          })
            .then(function(response) {
              if (response.success) {
                _.set($scope, 'model.options.spells', response.model);

                _.set($scope, 'model.selected.spells',
                  _.merge([], response.model, _.get($scope.$parent, 'model.spells'))
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
            'callback': $scope.back
          }];
        }]
      });
  }]);
