angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users.load', {
        templateUrl: 'templates/users/load.html'
      });
  }]);
