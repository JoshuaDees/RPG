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
