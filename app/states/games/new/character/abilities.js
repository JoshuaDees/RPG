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
