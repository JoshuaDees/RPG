angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.nav', {
        scope: {},
        templateUrl: 'app/templates/games/nav.html',
        controller: [
          '$scope',
          '$state',
          'KeyEventProvider',
        function(
          $scope,
          $state,
          KeyEventProvider
        ) {
          KeyEventProvider.actions = [
            {
              matches: ['l'],
              callback: function() { $state.transitionTo('games.load'); }
            },
            {
              matches: ['n'],
              callback: function() { $state.transitionTo('games.new.party'); }
            }
          ];
        }]
      });
  }]);
