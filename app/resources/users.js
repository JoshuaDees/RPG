angular
  .module('rpg')
  .factory('UsersResource', ['RestfulService', function(RestfulService) {
    var url = 'rest/users.php';

    var resource = RestfulService(url, null, {
      login: {
        method: 'POST',
        params: { action: 'login' }
      },
      logout: {},
      register: {}
    });

    return resource;
  }])
