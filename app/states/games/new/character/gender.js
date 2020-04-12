angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.new.character.gender', {
        scope: {},
        templateUrl: 'app/templates/games/new/character/gender.html',
        controller: [
          '$scope',
          '$state',
          '$stateParams',
          '$timeout',
          'CharactersResource',
          'KeyEventProvider',
        function(
          $scope,
          $state,
          $stateParams,
          $timeout,
          CharactersResource,
          KeyEventProvider
        ) {
          $scope.model = {
            items: [],
            selected: null
          };

          $scope.flags = {
            busy: true
          };

          $scope.accept = function() {
            $scope.$parent.update({
              'gender': $scope.model.selected
            });
          };

          CharactersResource.abort().genders()
            .then(function(response) {
              if (response.success) {
                $scope.model.items = response.model;

                $scope.model.selected = _.filter($scope.model.items, function(current, index) {
                  var selected = _.get($scope.$parent, 'model.gender.id');
                  return selected ? current.id == selected : index == 0;
                })[0];

                $timeout(function() {
                  $('[type=radio]' + ($('[type=radio][checked]').length ? '[checked]' : '')).first().focus();
                });
              } else {
                alert(response.message);
              }
            })
            .catch(function(error) {
              alert(error);
            })
            .finally(function() {
              $scope.flags.busy = false;
            });

          KeyEventProvider.actions = [
            {
              matches: ['Shift+Escape', 'Escape'],
              callback: function() {
                $state.transitionTo('games.new.character.details', { model: $scope.$parent.model });
              }
            }
          ];
        }]
      });
  }])
