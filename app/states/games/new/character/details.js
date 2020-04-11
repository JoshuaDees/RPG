angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.new.character.details', {
        state: {},
        controller: [
          '$scope',
          '$state',
          'KeyEventProvider',
        function(
          $scope,
          $state,
          KeyEventProvider
        ) {
          KeyEventProvider.actions = [{
            matches: ['Shift+Escape', 'Escape'],
            callback: function() {
              $state.transitionTo('games.new.party');
            }
          }, {
            matches: ['g|r|c|a|s|n'],
            callback: function(match) {
              console.log('g');
              $state.transitionTo('games.new.character.' + ({
                g: 'gender',
                r: 'race',
                c: 'class',
                a: 'abilities',
                s: 'skills',
                n: 'name'
              })[match], { model: $scope.$parent.model });
            }
          }];
        }]
      });
  }])
