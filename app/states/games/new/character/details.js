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
              var options = ({
                'r': {
                  'state': 'race'
                },
                'c': {
                  'requirement': 'race',
                  'state': 'class'
                },
                'a': {
                  'requirement': 'class',
                  'state': 'abilities'
                },
                's': {
                  'requirement': 'abilities',
                  'state': 'skills'
                },
                'n': {
                  'requirement': 'skills',
                  'state': 'name'
                }
              })[match];

              if (!options.requirement || _.get($scope.$parent, 'model.' + options.requirement)) {
                $state.transitionTo('games.new.character.' + options.state, {
                  'model': _.get($scope.$parent, 'model')
                });
              }
            }
          }];
        }]
      });
  }]);
