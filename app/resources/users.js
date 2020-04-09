angular
  .module('rpg')
  .factory('UsersResource', ['RestfulService', function(RestfulService) {
    return RestfulService('rest/users.php', null, {
      login: {
        method: 'POST',
        params: { action: 'login' }
      },
      logout: {
        method: 'POST',
        params: { action: 'logout' }
      },
      register: {
        method: 'POST',
        params: { action: 'register' }
      }
    });
  }])
