angular
  .module('rpg')
  .factory('CharactersResource', [
    'RestfulService',
  function(
    RestfulService
  ) {
    return RestfulService('data/characters.php', null, {
      'abilities': {
        'method': 'POST',
        'params': {
          'action': 'abilities'
        }
      },
      'classes': {
        'method': 'POST',
        'params': {
          'action': 'classes'
        }
      },
      'genders': {
        'method': 'POST',
        'params': {
          'action': 'genders'
        }
      },
      'races': {
        'method': 'POST',
        'params': {
          'action': 'races'
        }
      },
      'skills': {
        'method': 'POST',
        'params': {
          'action': 'skills'
        }
      },
      'specialities': {
        'method': 'POST',
        'params': {
          'action': 'specialities'
        }
      },
      'spells': {
        'method': 'POST',
        'params': {
          'action': 'spells'
        }
      }
    });
  }])
