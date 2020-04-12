angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.new.character', {
        abstract: true,
        scope: {},
        templateUrl: 'app/templates/games/new/character/character.html',
        params: {
          model: null
        },
        controller: [
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

          KeyEventProvider.actions = [{
            matches: ['Shift+Escape', 'Escape'],
            callback: function() { $state.transitionTo('games.new.party'); }
          }];

          $scope.update = function(property, value) {
            _.set($scope, 'model.' + property, value);

            $state.transitionTo('games.new.character.details', { model: $scope.model });
          };

          _.forEach(['race', 'class', 'attributes', 'skills', 'name'], function(attribute) {
            if (!_.get($scope, 'model.' + attribute)) {
              $state.transitionTo('games.new.character.' + attribute, { model: $scope.model });

              return false;
            }
          });
        }]
      });
  }])
