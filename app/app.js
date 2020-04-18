angular
  .module('rpg', ['angular.filter', 'ngResource', 'ngSanitize', 'ngScrollbars', 'ui.router'])
  .config(['ScrollBarsProvider', function(ScrollBarsProvider) {
    ScrollBarsProvider.defaults = {
      axis: 'y'
    };
  }]);
