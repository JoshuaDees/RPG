angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.new.character.abilities', {
        scope: {},
        templateUrl: 'app/templates/games/new/character/abilities.html',
        controller: [
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
            abilities: [],
            selected: [11, 11, 11, 11, 11, 11]
          };

          $scope.getValue = function(attribute) {
            return $scope.model.selected[attribute] +
              parseFloat(_.get($scope, 'model.abilities[' + attribute + '].raceModifier') || 0) +
              parseFloat(_.get($scope, 'model.abilities[' + attribute + '].classModifier') || 0);
          };

          $scope.getModifier = function(attribute) {
            var modifier = Math.floor(($scope.getValue(attribute) - 10) / 2);

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

          CharactersResource.abort().abilities({
            raceId: _.get($scope.$parent, 'model.race.id'),
            classId: _.get($scope.$parent, 'model.class.id')
          })
            .then(function(response) {
              if (response.success) {
                $scope.model.abilities = response.model;
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
