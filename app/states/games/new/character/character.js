angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new.character', {
        'abstract': true,
        'scope': {},
        //'templateUrl': 'app/templates/games/new/character/character.html',
        'params': {
          'model': null
        },
        'controller': [
          '$scope',
          '$state',
          '$stateParams',
          'KeyEventProvider',
        function(
          $scope,
          $state,
          $stateParams,
          KeyEventProvider
        ) {
          $scope.model = $stateParams.model || {};

          $scope.getAttributeValue = function(attribute) {
            return parseFloat(_.get(attribute, 'default')) +
              parseFloat(_.get(attribute, 'raceModifier') || 0) +
              parseFloat(_.get(attribute, 'classModifier') || 0) +
              parseFloat(_.get(attribute, 'bonus') || 0);
          };

          $scope.update = function(attributes, state) {
            _.forEach(attributes, function(value, property) {
              _.set($scope, 'model.' + property, value);
            });

            $state.transitionTo('games.new.character.' + state, {
              'model': $scope.model
            });
          };

          KeyEventProvider.actions = [{
            'matches': ['Shift+Escape', 'Escape'],
            'callback': function() {
              $state.transitionTo('games.new.party');
            }
          }];
        }]
      });
  }]);
