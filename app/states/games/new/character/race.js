angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new.character.race', {
        'scope': {},
        'templateUrl': 'app/templates/games/new/character/race.html',
        'controller': [
          '$q',
          '$scope',
          '$state',
          '$stateParams',
          '$timeout',
          'CharactersResource',
          'fixPlusMinusFilter',
          'KeyEventProvider',
          'replaceNewLinesFilter',
        function(
          $q,
          $scope,
          $state,
          $stateParams,
          $timeout,
          CharactersResource,
          fixPlusMinusFilter,
          KeyEventProvider,
          replaceNewLinesFilter
        ) {
          $scope.$parent.step = 'race';

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
            'loading': true
          };

          $scope.accept = function() {
            _.invoke($scope.$parent, 'update', _.get($scope, 'model.selected'), 'class');
          };

          $scope.back = function() {
            $state.transitionTo('games.new.party');
          };

          $scope.getSelection = function(selection) {
            return _.get($scope, 'model.selected.' + selection, $scope.$parent.getSelection(selection));
          };

          CharactersResource.abort();

          var promises = {};

          promises.genders = CharactersResource.genders()
            .then(function(response) {
              if (response.success) {
                _.set($scope, 'model.options.genders', response.model);

                _.set($scope, 'model.selected.gender', _.filter(
                  _.get($scope, 'model.options.genders'),
                  function(current, index) {
                    var selected = _.get($scope.$parent, 'model.gender.GenderId');
                    return selected ? current.GenderId == selected : index == 0;
                  }
                )[0]);
              } else {
                ErrorProvider.alert(response.message);
              }
            })
            .catch(function(error) {
              ErrorProvider.alert(error);
            });

          promises.races = CharactersResource.races()
            .then(function(response) {
              if (response.success) {
                _.set($scope, 'model.options.races', response.model);

                _.set($scope, 'model.selected.race', _.filter(
                  _.get($scope, 'model.options.races'),
                  function(current, index) {
                    var selected = _.get($scope.$parent, 'model.race.RaceId');
                    return selected ? current.RaceId == selected : index == 0;
                  }
                )[0]);
              } else {
                ErrorProvider.alert(response.message);
              }
            })
            .catch(function(error) {
              ErrorProvider.alert(error);
            });

          $q.all(promises)
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
