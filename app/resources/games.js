angular
  .module('rpg')
  .factory('GamesResource', ['RestfulService', function(RestfulService) {
    return RestfulService('rest/games.php', null, {
      load: {
        params: { action: 'load' }
      }
    });
  }])
