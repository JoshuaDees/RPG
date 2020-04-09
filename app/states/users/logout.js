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
    'UsersResource',
  function(
    $state,
    SessionProvider,
    UsersResource
  ) {
    UsersResource.abort().logout()
      .then(function(response) {
        if (response.success) {
          SessionProvider.remove('userId');

          $state.transitionTo('users.login');
        } else {
          alert(response.message);
        }
      })
      .catch(function(error) {
        alert(error);
      })
  }]);
