angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users', {
        abstract: true,
        template: '<ui-view />'
      });
  }]);
