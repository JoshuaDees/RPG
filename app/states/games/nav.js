angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.nav', {
        controller: 'GamesNavController',
        templateUrl: 'app/templates/games/nav.html'
      });
  }])
  .controller('GamesNavController', [
    '$scope',
    'KeyEventProvider',
  function(
    $scope,
    KeyEventProvider
  ) {
    KeyEventProvider.actions = [];
  }]);
