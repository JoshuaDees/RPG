angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('users.login', {
        scope: {},
        templateUrl: 'app/templates/users/login.html',
        controller: [
          '$scope',
          '$state',
          'ErrorProvider',
          'KeyEventProvider',
          'SessionProvider',
          'UsersResource',
        function(
          $scope,
          $state,
          ErrorProvider,
          KeyEventProvider,
          SessionProvider,
          UsersResource
        ) {
          $scope.flags = {
            busy: false
          };

          $scope.login = function() {
            $scope.flags.busy = true;

            UsersResource.abort().login($scope.model)
              .then(function(response) {
                if (response.success) {
                  SessionProvider.set('userId', response.model.id);
                  SessionProvider.set('userName', response.model.name);

                  $state.transitionTo('games.nav');
                } else {
                  ErrorProvider.alert(response.error);
                }
              })
              .catch(function(error) {
                alert(error);
              })
              .finally(function() {
                $scope.flags.busy = false;
              });

            KeyEventProvider.actions = [];
          };
        }]
      });
  }]);
