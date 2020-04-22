angular
  .module('rpg')
  .factory('CharactersResource', [
    'RestfulService',
  function(
    RestfulService
  ) {
    return RestfulService('data/characters.php', null, [
      'abilities',
      'classes',
      'genders',
      'races',
      'skills',
      'specialities',
      'spells'
    ]);
  }])
