angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('games.new.character.name', {
        'scope': {},
        'templateUrl': 'app/templates/games/new/character/name.html',
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
          $scope.model = {
            'selected': _.get($scope.$parent, 'model.name')
          };

          $scope.accept = function() {
            _.invoke($scope.$parent, 'update', {
              'name': _.get($scope.model, 'selected')
            });
          };

          $scope.back = function() {
            $scope.transitionTo('games.new.character.' + (
              _.get($scope.$parent, 'model.class.ClassSpells', 0) ? 'spells' : 'skills'
            ), {
              model: _.get($scope.$parent, 'model')
            });
          };

          $scope.getAbilityValue = function(ability) {
            return parseFloat(_.get(ability, 'AbilityDefault') || 0) +
              parseFloat(_.get(ability, 'AbilityRaceModifier') || 0) +
              parseFloat(_.get(ability, 'AbilityClassModifier') || 0) +
              parseFloat(_.get(ability, 'AbilityBonus') || 0);
          };

          $scope.getSelectedSkills = function() {
            return _.filter(_.get($scope.$parent, 'model.skills'), function(skill) {
              return skill.SkillSelected;
            });
          };

          $scope.getSelectedSpells = function() {
            return _.filter(_.get($scope.$parent, 'model.spells'), function(spell) {
              return spell.SpellSelected;
            });
          };

          KeyEventProvider.actions = [{
            'matches': ['Shift+Escape', 'Escape'],
            'callback': function() {
              $state.transitionTo('games.new.character.details', {
                'model': _.get($scope.$parent, 'model')
              });
            }
          }];
        }]
      });
  }]);
