angular
  .module('rpg')
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
          $scope.$parent.step = 'abilities';

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
            return parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].AbilityDefault')) +
              parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].AbilityRaceModifier') || 0) +
              parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].AbilityClassModifier') || 0) +
              $scope.getBonus(attribute);
          };

          $scope.getBonus = function(attribute) {
            var bonus;

            if (attribute != undefined) {
              bonus = parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].AbilityBonus') || 0);
            } else {
              bonus = parseFloat(_.get($scope, 'model.details.bonus'));

              _.forEach(_.get($scope, 'model.selected.abilities'), function(details, ability) {
                bonus -= $scope.getBonus(ability);
              });
            }

            return bonus;
          };

          $scope.increment = function(attribute, $event) {
            _.set($scope, 'model.selected.abilities[' + attribute + '].AbilityBonus',
              parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].AbilityBonus') || 0) + 1
            );

            $event.preventDefault();
          };

          $scope.decrement = function(attribute, $event) {
            _.set($scope, 'model.selected.abilities[' + attribute + '].AbilityBonus',
              parseFloat(_.get($scope, 'model.selected.abilities[' + attribute + '].AbilityBonus') || 0) - 1
            );

            $event.preventDefault();
          };

          $scope.accept = function() {
            _.invoke($scope.$parent, 'update', _.get($scope, 'model.selected'), 'skills');
          };

          $scope.back = function() {
            $state.transitionTo('games.new.character.' + (
              _.get($scope.$parent, 'model.class.ClassSpecialities', 0) ? 'speciality' : 'class'
            ), {
              'model': _.get($scope.$parent, 'model')
            });
          };

          CharactersResource.abort().abilities({
            'raceId': _.get($scope.$parent, 'model.race.RaceId'),
            'classId': _.get($scope.$parent, 'model.class.ClassId')
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
            'callback': $scope.back
          }];
        }]
      });
  }]);
