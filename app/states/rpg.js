angular
  .module('rpg')
  .controller('RPGController', [
    '$scope',
    '$state',
    'SessionProvider',
  function(
    $scope,
    $state,
    SessionProvider
  ) {
    if (SessionProvider.get('userId')) {
      $state.transitionTo('users.load');
    } else {
      $state.transitionTo('users.login');
    }

    $scope.transitionTo = function(state) {
      $state.transitionTo(state);
    };
  }]);
