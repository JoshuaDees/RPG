angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.new', {
        abstract: true,
        controller: 'NewGameController',
        template: '<ui-view />'
      });
  }])
  .controller('NewGameController', [
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
        race: { name: 'Half-Orc' },
        'class': { name: 'Knight' },
        gender: { name: 'Male' }
      }, {
        name: 'Sir Galland',
        race: { name: 'Dwarf' },
        'class': { name: 'Paladin' },
        gender: { name: 'Male' }
      }, {
        name: 'Sure Valla',
        race: { name: 'Half-Elf' },
        'class': { name: 'Archer' },
        gender: { name: 'Female' }
      }, {
        name: 'Swifty Sarg',
        race: { name: 'Gnome' },
        'class': { name: 'Robber' },
        gender: { name: 'Male' }
      }, {
        name: 'Serena',
        race: { name: 'Human' },
        'class': { name: 'Cleric' },
        gender: { name: 'Female' }
      }, {
        name: 'Wizz Bane',
        race: { name: 'Elf' },
        'class': { name: 'Sorcerer' },
        gender: { name: 'Male' }
      }]
    };

    $scope.isTeamFull = function() {
      return _.compact($scope.model.characters).length === 6;
    };
  }]);
