angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.load', {
        controller: 'LoadController',
        templateUrl: 'templates/games/load.html'
      });
  }])
  .controller('LoadController', [
    '$scope',
    '$state',
    'GamesResource',
    'SessionProvider',
  function(
    $scope,
    $state,
    GamesResource,
    SessionProvider
  ) {
    $scope.model = {
      userId: SessionProvider.get('userId')
    };

    $scope.flags = {
      busy: true
    };

    $scope.load = function() {
      // TODO:
    };

    GamesResource.abort().load()
      .then(function(response) {
        if (response.success) {
          $scope.games = response.games;

          if ($scope.games) {
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
