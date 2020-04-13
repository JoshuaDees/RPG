angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('users.logout', {
        'scope': {},
        'controller': [
          '$state',
          'KeyEventProvider',
          'SessionProvider',
          'UsersResource',
        function(
          $state,
          KeyEventProvider,
          SessionProvider,
          UsersResource
        ) {
          UsersResource.abort().logout()
            .then(function(response) {
              if (response.success) {
                SessionProvider.remove('userId');

                $state.transitionTo('users.login');
              } else {
                ErrorProvider.alert(response.message);
              }
            })
            .catch(function(error) {
              ErrorProvider.alert(error);
            });

          KeyEventProvider.actions = [];
        }]
      });
  }]);
