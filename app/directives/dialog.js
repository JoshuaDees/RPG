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
    '$timeout',
    'DialogService',
  function(
    $timeout,
    DialogService
  ) {
    return {
      restrict: 'E',
      link: function($scope, $element) {
        $timeout(function() {
          $element[0].showModal();
        });
      }
    }
  }]);
