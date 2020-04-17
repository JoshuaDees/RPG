angular
  .module('rpg')
  .filter('replaceNewLines', [
    '$sce',
  function(
    $sce
  ) {
    return function(string) {
      return (string || '')
        .replace(/\n/g, '<br />');
    };
  }]);
