angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.new', {
        abstract: true,
        scope: {},
        template: '<ui-view />',
        controller: [
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
            userId: SessionProvider.get('userId'),
            characters: [{
              name: 'Crag Hack',
              gender: { id: 1, name: 'Male' },
              race: { id: 6, name: 'Half-Orc' },
              class: { id: 1, name: 'Barbarian' },
              portrait: 'half-orc.male.1',
              abilities: {
                might: 15,
                intellect: 7,
                personality: 9,
                endurance: 13,
                accuracy: 9,
                speed: 11
              },
              skills: []
            }, {}, {}, {}, {}, {}]
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
