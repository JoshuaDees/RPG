angular
  .module('rpg')
  .config([
    '$stateProvider',
  function(
    $stateProvider
  ) {
    $stateProvider
      .state('users', {
        'abstract': true,
        'scope': {},
        'template': '<ui-view />'
      });
  }]);
