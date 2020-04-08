angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users', {
        abstract: true,
        templateUrl: 'templates/users/users.html'
      });
  }]);
