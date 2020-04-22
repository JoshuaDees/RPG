angular
  .module('rpg')
  .factory('UsersResource', [
    'RestfulService',
  function(
    RestfulService
  ) {
    return RestfulService('data/users.php', null, [
      'login',
      'logout',
      'register'
    ]);
  }]);
