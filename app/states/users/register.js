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
          'KeyEventProvider',
          'SessionProvider',
          'UsersResource',
        function(
          $scope,
          $state,
          KeyEventProvider,
          SessionProvider,
          UsersResource
        ) {
          $scope.flags = {
            'loading': false
          };

          $scope.register = function() {
            if(_.get($scope, 'model.pass') === _.get($scope, 'model.pass2')) {
              _.set($scope, 'flags.busy', true);

              UsersResource.abort().register($scope.model)
                .then(function(response) {
                  if (response.success) {
                    SessionProvider.set('userId', response.model.id);
                    SessionProvider.set('userName', response.model.name);

                    $state.transitionTo('games.menu');
                  } else {
                    alert(response.error);
                  }
                })
                .catch(function(error) {
                  alert(error);
                })
                .finally(function() {
                  _.set($scope, 'flags.busy', false);
                });
            } else {
              alert('The passwords do not match.');
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
