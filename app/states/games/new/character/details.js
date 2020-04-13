angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new.character.details', {
        'state': {},
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
              $state.transitionTo('games.new.party');
            }
          }, {
            'matches': ['r|c|a|s|n'],
            'callback': function(match) {
              $state.transitionTo('games.new.character.' + ({
                'r': 'race',
                'c': 'class',
                'a': 'abilities',
                's': 'skills',
                'n': 'name'
              })[match], {
                'model': $scope.$parent.model
              });
            }
          }];
        }]
      });
  }]);
