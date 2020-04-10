angular
  .module('rpg')
  .factory('DialogService', function() {
    $(window).on('resize', function() {
      $('dialog').each(function(index, dialog) {
        dialog.close();
        dialog.showModal();
      })
    });

    return {};
  })
  .directive('dialog', [
    'DialogService',
  function(
    DialogService
  ) {
    return {
      restrict: 'E',
      link: function($scope, $element) {
        $element[0].showModal();
      }
    }
  }]);
