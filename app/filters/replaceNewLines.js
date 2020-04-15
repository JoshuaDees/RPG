angular
  .module('rpg')
  .filter('replaceNewLines', [
    '$sce',
  function(
    $sce
  ) {
    return function(string, paragraphClass) {
      console.log(arguments);
      var prefix = '<p class="' + (paragraphClass || '') + '">';
      var suffix = '</p>';

      return prefix + $sce.trustAsHtml((string || '').replace(/\\n/g, suffix + prefix)) + suffix;
    };
  }]);
