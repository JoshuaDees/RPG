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
          function getIntellectModifier() {
            var intellect = _.get($scope.$parent, 'model.abilities[1]');

            var total = _.get(intellect, 'default', 0) +
              _.get(intellect, 'raceModifier', 0) +
              _.get(intellect, 'classModifier', 0) +
              _.get(intellect, 'bonus', 0);

            return Math.floor((total - 10) / 2);
          };

          $scope.model = {
            'selected': {
              'skills': []
            },
            'details': {
              'points': 4 + getIntellectModifier()
            }
          };

          $scope.flags = {
            'loading': true
          };

          $scope.getPointsLeft = function() {
            return _.get($scope, 'model.details.points') -
              _.filter(_.get($scope, 'model.selected.skills'), function(skill) {
                return skill.selected == true;
              }).length;
          };

          $scope.accept = function() {
            _.invoke($scope.$parent, 'update', _.get($scope, 'model.selected'));
          };

          CharactersResource.abort().skills({
            'raceId': _.get($scope.$parent, 'model.race.id'),
            'classId': _.get($scope.$parent, 'model.class.id')
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
            'callback': function() {
              $state.transitionTo('games.new.character.abilities', {
                'model': _.get($scope.$parent, 'model')
              });
            }
          }];
        }]
      });
  }]);
