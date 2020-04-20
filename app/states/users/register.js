angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('users.register', {
        'scope': {},
        'templateUrl': 'app/templates/users/register.html',
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

          $scope.register = function() {
            if(_.get($scope, 'model.pass') === _.get($scope, 'model.pass2')) {
              _.set($scope, 'flags.loading', true);

              UsersResource.abort().register($scope.model)
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
            } else {
              ErrorProvider.alert('The passwords do not match.');
            }
          };

          KeyEventProvider.actions = [{
              'matches': ['Shift+Escape', 'Escape'],
              'callback': function() {
                $state.transitionTo('users.login');
              }
            }];
        }]
      });
  }]);
