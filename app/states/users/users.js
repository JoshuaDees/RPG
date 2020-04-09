angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users', {
        abstract: true,
        templateUrl: 'app/templates/users/users.html'
      });
  }]);
