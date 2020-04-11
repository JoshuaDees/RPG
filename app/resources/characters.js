angular
  .module('rpg')
  .factory('CharactersResource', ['RestfulService', function(RestfulService) {
    return RestfulService('data/characters.php', null, {
      classes: {
        method: 'POST',
        params: { action: 'classes' }
      },
      genders: {
        method: 'POST',
        params: { action: 'genders' }
      },
      races: {
        method: 'POST',
        params: { action: 'races' }
      }
    });
  }])
