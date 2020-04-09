angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games', {
        abstract: true,
        template: '<ui-view />'
      });
  }]);
