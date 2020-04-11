angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.new.party', {
        controller: 'GamesNewPartyController',
        templateUrl: 'app/templates/games/new/party.html'
      });
  }])
  .controller('GamesNewPartyController', [
    '$state',
    'KeyEventProvider',
  function(
    $state,
    KeyEventProvider
  ) {
    KeyEventProvider.actions = [
      {
        matches: /(Shift\+)?Escape/,
        callback: function() { $state.transitionTo('games.nav'); }
      }
    ];
  }]);
