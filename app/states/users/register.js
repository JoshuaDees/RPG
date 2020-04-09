angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users.register', {
        controller: 'RegisterController',
        templateUrl: 'app/templates/users/register.html'
      });
  }])
  .controller('RegisterController', [
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

    $scope.register = function() {
      console.log($scope.model);

      if($scope.model.pass === $scope.model.pass2) {
        $scope.flags.busy = true;

        UsersResource.abort().register($scope.model)
          .then(function(response) {
            if (response.success) {
              SessionProvider.set('userId', response.model.id);

              $state.transitionTo('games.load');
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
      } else {
        alert('The passwords do not match.');
      }
    };
  }]);
