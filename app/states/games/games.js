angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games', {
        abstract: {},
        scope: true,
        template: '<ui-view />',
        controller: [
          '$scope',
          'GamesResource',
          'KeyEventProvider',
          'SessionProvider',
        function(
          $scope,
          GamesResource,
          KeyEventProvider,
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

          KeyEventProvider.actions = [];
        }]
      });
  }]);
