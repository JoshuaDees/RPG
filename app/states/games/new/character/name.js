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
            $scope.$parent.update({
              'name': $scope.model.selected
            });
          };

          KeyEventProvider.actions = [{
            'matches': ['Shift+Escape', 'Escape'],
            'callback': function() {
              $state.transitionTo('games.new.character.details', {
                'model': $scope.$parent.model
              });
            }
          }];
        }]
      });
  }]);
