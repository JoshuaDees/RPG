angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new.character.skills', {
        'scope': {},
        'templateUrl': 'app/templates/games/new/character/skills.html',
        'controller': [
          '$scope',
          '$state',
          '$stateParams',
          'CharactersResource',
          'KeyEventProvider',
        function(
          $scope,
          $state,
          $stateParams,
          CharactersResource,
          KeyEventProvider
        ) {
          $scope.$parent.step = 'skills';

          $scope.model = {
            'selected': {
              'skills': []
            },
            'details': {
              'points': 0
            }
          };

          $scope.flags = {
            'loading': true
          };

          $scope.getPointsLeft = function() {
            return _.get($scope, 'model.details.points') -
              _.filter(_.get($scope, 'model.selected.skills'), function(skill) {
                return skill.SkillSelected == true;
              }).length;
          };

          $scope.accept = function() {
            _.invoke($scope.$parent, 'update', _.get($scope, 'model.selected'), (
              _.get($scope.$parent, 'model.class.ClassSpells', 0) ? 'spells' : 'name'
            ));
          };

          $scope.back = function() {
            $scope.transitionTo('games.new.character.abilities', {
              model: _.get($scope.$parent, 'model')
            });
          };

          CharactersResource.abort().skills({
            'raceId': _.get($scope.$parent, 'model.race.RaceId'),
            'classId': _.get($scope.$parent, 'model.class.ClassId')
          })
            .then(function(response) {
              if (response.success) {
                _.set($scope, 'model.options.skills', response.model);

                _.set($scope, 'model.selected.skills',
                  _.merge([], response.model, _.get($scope.$parent, 'model.skills'))
                );
              } else {
                ErrorProvider.alert(response.message);
              }
            })
            .catch(function(error) {
              ErrorProvider.alert(error);
            })
            .finally(function() {
              _.set($scope, 'flags.loading', false);
            });

          KeyEventProvider.actions = [{
            'matches': ['Shift+Escape', 'Escape'],
            'callback': $scope.back
          }];
        }]
      });
  }]);
