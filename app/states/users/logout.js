angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users.logout', {
        controller: 'LogoutController'
      });
  }])
  .controller('LogoutController', [
    '$state',
    'SessionProvider',
  function(
    $state,
    SessionProvider
  ) {
    SessionProvider.remove('userId');

    $state.transitionTo('users.login');
  }]);
