angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new.character.speciality', {
        'scope': {},
        'templateUrl': 'app/templates/games/new/character/speciality.html',
        'controller': [
          '$scope',
          '$state',
          '$stateParams',
          '$timeout',
          'CharactersResource',
          'fixPlusMinusFilter',
          'KeyEventProvider',
          'replaceNewLinesFilter',
        function(
          $scope,
          $state,
          $stateParams,
          $timeout,
          CharactersResource,
          fixPlusMinusFilter,
          KeyEventProvider,
          replaceNewLinesFilter
        ) {
          $scope.model = {
            'options': {
              'class': []
            },
            'selected': {
              'speciality': null
            }
          };

          $scope.flags = {
            'loading': true
          };

          $scope.accept = function() {
            _.invoke($scope.$parent, 'update', _.get($scope, 'model.selected'), 'abilities');
          };

          $scope.back = function() {
            $state.transitionTo('games.new.character.class', {
              'model': _.get($scope.$parent, 'model')
            });
          };

          CharactersResource.abort().specialities({
            'raceId': _.get($scope.$parent, 'model.race.RaceId'),
            'classId': _.get($scope.$parent, 'model.class.ClassId')
          })
            .then(function(response) {
              if (response.success) {
                _.set($scope, 'model.options.specialties', response.model);

                _.set($scope, 'model.selected.speciality', _.filter(
                  _.get($scope, 'model.options.specialties'),
                  function(current, index) {
                    var selected = _.get($scope.$parent, 'model.speciality.SpecialityId');
                    return selected ? current.SpecialityId == selected : index == 0;
                  }
                )[0]);
              } else {
                ErrorProvider.alert(response.message);
              }
            })
            .catch(function(error) {
              ErrorProvider.alert(error);
            })
            .finally(function() {
              _.set($scope, 'flags.loading', false);

              $timeout(function() {
                $('[type=radio]' + ($('[type=radio][checked]').length ? '[checked]' : '')).first().focus();
              });
            });

          KeyEventProvider.actions = [{
            'matches': ['Shift+Escape', 'Escape'],
            'callback': $scope.back
          }];
        }]
      });
  }]);
