angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users.load', {
        controller: 'LoadController',
        templateUrl: 'templates/users/load.html'
      });
  }])
  .controller('LoadController', [
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
    $scope.model = {
      gameId: 1,
      userId: SessionProvider.get('userId')
    };

    $scope.load = function() {
      // TODO:
    };
  }]);
