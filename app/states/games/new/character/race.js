angular
  .module('rpg')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('games.new.character.race', {
        scope: {},
        templateUrl: 'app/templates/games/new/character/race.html',
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
            'options': {
              'genders': [],
              'races': []
            },
            'selected': {
              'gender': null,
              'race': null
            }
          };

          $scope.flags = {
            'busy': true
          };

          $scope.accept = function() {
            $scope.$parent.update($scope.model.selected);
          };

          CharactersResource.abort();

          CharactersResource.genders()
            .then(function(response) {
              if (response.success) {
                _.set($scope, 'model.options.genders', response.model);

                _.set($scope, 'model.selected.gender', _.filter(
                  _.get($scope, 'model.options.genders'),
                  function(current, index) {
                    var selected = _.get($scope.$parent, 'model.gender.id');
                    return selected ? current.id == selected : index == 0;
                  }
                )[0]);
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

          CharactersResource.races()
            .then(function(response) {
              if (response.success) {
                _.set($scope, 'model.options.races', response.model);

                _.set($scope, 'model.selected.race', _.filter(
                  _.get($scope, 'model.options.races'),
                  function(current, index) {
                    var selected = _.get($scope.$parent, 'model.race.id');
                    return selected ? current.id == selected : index == 0;
                  }
                )[0]);
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
