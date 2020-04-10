angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users.login', {
        controller: 'LoginController',
        templateUrl: 'app/templates/users/login.html'
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
    $scope.flags = {
      busy: false
    };

    $scope.login = function() {
      $scope.flags.busy = true;

      UsersResource.abort().login($scope.model)
        .then(function(response) {
          if (response.success) {
            SessionProvider.set('userId', response.model.id);
            SessionProvider.set('userName', response.model.name);

            $state.transitionTo('games.menu');
          } else {
            alert(response.error);
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
