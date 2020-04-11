angular
  .module('rpg')
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
              callback: function() { $state.transitionTo('games.nav'); }
            }
          ];
        }]
      });
  }]);
