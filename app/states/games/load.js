angular
  .module('rpg')
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
