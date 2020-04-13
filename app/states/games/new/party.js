angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new.party', {
        'scope': {},
        'templateUrl': 'app/templates/games/new/party.html',
        'controller': [
          '$scope',
          '$state',
          'KeyEventProvider',
        function(
          $scope,
          $state,
          KeyEventProvider
        ) {
          KeyEventProvider.actions = [{
            'matches': ['Shift+Escape', 'Escape'],
            'callback': function() {
              $state.transitionTo('games.menu');
            }
          }, {
            'matches': ['1|2|3|4|5|6'],
            'callback': function(match) {
              $state.transitionTo('games.new.character.details', {
                'model': _get($scope, '$parent.model.characters[' + (match - 1) + ']')
              });
            }
          }];
        }]
      });
  }]);
