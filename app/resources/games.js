angular
  .module('rpg')
  .factory('GamesResource', [
    'RestfulService',
  function(
    RestfulService
  ) {
    return RestfulService('data/games.php', null, {
      'load': {
        'method': 'POST',
        'params': {
          'action': 'load'
        }
      }
    });
  }])
