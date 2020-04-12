angular
  .module('rpg')
  .controller('RPGController', [
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
    if (SessionProvider.get('userId')) {
      $state.transitionTo('games.menu');
    } else {
      $state.transitionTo('users.login');
    }

    $scope.transitionTo = function(state, params) {
      $state.transitionTo(state, params);
    };
  }]);
