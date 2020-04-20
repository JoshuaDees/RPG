angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('users.login', {
        'scope': {},
        'templateUrl': 'app/templates/users/login.html',
        'controller': [
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
            'loading': false
          };

          $scope.login = function() {
            _.set($scope, 'flags.loading', true);

            UsersResource.abort().login($scope.model)
              .then(function(response) {
                if (response.success) {
                  SessionProvider.set('userId', response.model.UserId);
                  SessionProvider.set('userName', response.model.UserName);

                  $state.transitionTo('games.menu');
                } else {
                  ErrorProvider.alert(response.error);
                }
              })
              .catch(function(error) {
                ErrorProvider.alert(error);
              })
              .finally(function() {
                _.set($scope, 'flags.loading', false);
              });

            KeyEventProvider.actions = [];
          };
        }]
      });
  }]);
