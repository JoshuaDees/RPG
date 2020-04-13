angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new.character.name', {
        'scope': {},
        'templateUrl': 'app/templates/games/new/character/name.html',
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
          $scope.model = {
            'selected': _.get($scope.$parent, 'model.name')
          };

          $scope.accept = function() {
            _.invoke($scope.$parent, 'update', {
              'name': _.get($scope.model, 'selected')
            });
          };

          KeyEventProvider.actions = [{
            'matches': ['Shift+Escape', 'Escape'],
            'callback': function() {
              $state.transitionTo('games.new.character.details', {
                'model': _.get($scope.$parent, 'model')
              });
            }
          }];
        }]
      });
  }]);
