angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.new', {
        controller: 'NewGameController',
        templateUrl: 'app/templates/games/new.html'
      });
  }])
  .controller('NewGameController', [
    '$scope',
    '$state',
    'KeyEventProvider',
    'SessionProvider',
  function(
    $scope,
    $state,
    KeyEventProvider,
    SessionProvider
  ) {
    $scope.model = {
      userId: SessionProvider.get('userId')
    };

    KeyEventProvider.actions = [
      {
        matches: /(Shift\+)?Escape/,
        callback: function() { $state.transitionTo('games.menu'); }
      }
    ];
  }]);
