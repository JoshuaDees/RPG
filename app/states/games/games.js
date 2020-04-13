angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games', {
        'abstract': {},
        'scope': true,
        'template': '<ui-view />',
        'controller': [
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
            'userId': SessionProvider.get('userId')
          };

          $scope.flags = {
            'loading': true
          };

          GamesResource.abort().load($scope.model)
            .then(function(response) {
              if (response.success) {
                $scope.games = response.model;

                _.set($scope, 'model.gameId',
                  _.get($scope, 'games[0].id')
                );
              } else {
                ErrorProvider.alert(response.message);
              }
            })
            .catch(function(error) {
              ErrorProvider.alert(error);
            })
            .finally(function() {
              _.set($scope, 'flags.loading', false);
            });

          KeyEventProvider.actions = [];
        }]
      });
  }]);
