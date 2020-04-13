angular
  .module('rpg')
  .filter('modifier', function() {
    return function(modifier) {
      return '' + (modifier > 0 ? '+' : '') + modifier;
    };
  });
