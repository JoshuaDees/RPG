angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new', {
        'abstract': true,
        'scope': {},
        'template': '<ui-view />',
        'controller': [
          '$scope',
          '$state',
          'KeyEventProvider',
          'SessionProvider',
        function(
          $scope,
          $state,
          KeyEventProvider,
          SessionProvider
        ) {
          $scope.model = {
            'userId': SessionProvider.get('userId'),
            'characters': [{}, {}, {}, {}, {}, {}]
          };

          $scope.isTeamFull = function() {
            return _.filter($scope.model.characters, function(character) {
              return character.name;
            }).length === 6;
          };

          KeyEventProvider.actions = [];
        }]
      });
  }]);
