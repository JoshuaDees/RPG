angular
  .module('rpg')
  .factory('KeyService', function() {
    return new function() {
      this.getString = function($event) {
        return _.compact([
          $event.ctrlKey ? 'Ctrl' : '',
          $event.altKey ? 'Alt' : '',
          $event.shiftKey ? 'Shift' : '',
          (
            ($event.key === 'Control' && $event.ctrlKey) ||
            ($event.key === 'Alt' && $event.altKey) ||
            ($event.key === 'Shift' && $event.shiftKey) ||
            ($event.key === 'Meta' && $event.metaKey)
          ) ? '' : $event.key
        ]).join('+') || '';
      };
    }();
  })
  .factory('DialogService', [
    'KeyService',
  function(
    KeyService
  ) {
    $(window).on('resize', function() {
      $('dialog').each(function(index, dialog) {
        dialog.close();
        dialog.showModal();
      })
    });

    $(document).on('keydown keyup keypress', function($event) {
      if(KeyService.getString($event).match(/(Shift\+)?Escape/)) {
        $event.preventDefault();
      }
    });

    return {};
  }])
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
