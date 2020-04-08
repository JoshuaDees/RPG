angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users.login', {
        controller: 'LoginController',
        templateUrl: 'templates/users/login.html'
      });
  }])
  .controller('LoginController', [
    '$scope',
    '$state',
    'SessionProvider',
    'UsersResource',
  function(
    $scope,
    $state,
    SessionProvider,
    UsersResource
  ) {
    $scope.model = { user: 'anubis', pass: 'munky1483' };
    $scope.flags = { busy: false };

    $scope.login = function() {
      $scope.flags.busy = true;

      UsersResource.abort().login($scope.model)
        .then(function(response) {
          if (response.success) {
            SessionProvider.set('userId', response.id);

            $state.transitionTo('users.load');
          } else {
            alert(response.message);
          }
        })
        .catch(function(error) {
          alert(error);
        })
        .finally(function() {
          $scope.flags.busy = false;
        });
    };
  }]);
