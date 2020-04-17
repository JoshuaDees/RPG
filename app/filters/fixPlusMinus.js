angular
  .module('rpg')
  .filter('fixPlusMinus', [
    '$sce',
  function(
    $sce
  ) {
    return function(string) {
      return (string || '')
        .replace(/\+(\d)/g, function(match, number) {
          return '<i class="fa fa-plus"></i>' + number;
        })
        .replace(/\-(\d)/g, function(match, number) {
          return '<i class="fa fa-minus"></i>' + number;
        });
    };
  }]);
