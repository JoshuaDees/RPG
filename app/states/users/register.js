angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users.register', {
        templateUrl: 'templates/users/register.html'
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
      $scope.register = function() {
        // TODO:
      };
  }]);
