angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games', {
        abstract: true,
        controller: 'GamesController',
        template: '<ui-view />'
      });
  }])
  .controller('GamesController', [
    '$scope',
    'GamesResource',
    'SessionProvider',
  function(
    $scope,
    GamesResource,
    SessionProvider
  ) {
    $scope.model = {
      userId: SessionProvider.get('userId')
    };

    $scope.flags = {
      busy: true
    };

    GamesResource.abort().load($scope.model)
      .then(function(response) {
        if (response.success) {
          $scope.games = response.model;

          if (_.get($scope, 'games[0]')) {
            $scope.model.gameId = $scope.games[0].id;
          }
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
  }]);
