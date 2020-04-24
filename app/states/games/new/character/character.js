angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new.character', {
        'abstract': true,
        'scope': {},
        'params': {
          'model': null
        },
        'controller': [
          '$scope',
          '$state',
          '$stateParams',
          'KeyEventProvider',
        function(
          $scope,
          $state,
          $stateParams,
          KeyEventProvider
        ) {
          $scope.model = $stateParams.model || {};

          $scope.step = null;

          $scope.isStepEnabled = function(step) {
            switch (step) {
              case 'class':
                return !!_.get($scope, 'model.race');
                break;
              case 'speciality':
                return !!(_.get($scope, 'model.class') && _.get($scope, 'model.class.ClassSpecialities'));
                break;
              case 'abilities':
                return !!(
                  _.get($scope, 'model.speciality') ||
                  (_.get($scope, 'model.class') && !_.get($scope, 'model.class.ClassSpecialities'))
                );
                break;
              case 'skills':
                return !!_.get($scope, 'model.abilities');
                break;
              case 'spells':
                return !!(_.get($scope, 'model.skills') && _.get($scope, 'model.class.ClassSpells'));
                break;
              case 'name':
                return !!(
                  _.get($scope, 'model.spells') ||
                  (_.get($scope, 'model.skills') && !_.get($scope, 'model.class.ClassSpells'))
                );
                break;
              default:
                return false;
                break;
            }
          };

          $scope.getAttributeValue = function(attribute) {
            return parseFloat(_.get(attribute, 'default')) +
              parseFloat(_.get(attribute, 'raceModifier') || 0) +
              parseFloat(_.get(attribute, 'classModifier') || 0) +
              parseFloat(_.get(attribute, 'bonus') || 0);
          };

          $scope.getSelection = function(selection) {
            return _.get($scope, 'model.' + selection);
          };

          $scope.update = function(attributes, state) {
            _.assign($scope.model, attributes);

            $state.transitionTo('games.new.character.' + state, {
              'model': $scope.model
            });
          };

          $scope.save = function(attributes) {
            _.assign($scope.model, attributes);

            $state.transitionTo('games.new.party');
          };

          KeyEventProvider.actions = [{
            'matches': ['Shift+Escape', 'Escape'],
            'callback': function() {
              $state.transitionTo('games.new.party');
            }
          }];
        }]
      });
  }]);
