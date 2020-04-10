angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.menu', {
        controller: 'GamesMenuController',
        templateUrl: 'app/templates/games/menu.html'
      });
  }])
  .controller('GamesMenuController', [
    '$scope',
    'KeyEventProvider',
  function(
    $scope,
    KeyEventProvider
  ) {
    KeyEventProvider.actions = [];
  }]);
