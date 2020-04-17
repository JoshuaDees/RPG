angular
  .module('rpg')
  .factory('FocusProvider', function() {
    return new function() {
      // TODO: Fix issues with tabs being buttons and stealing focus

      $(document).on('mousedown', function($event) {
        if ($event.target.tagName.match(/(input|button|label)/i) == null) {
          $event.preventDefault();
        }
      });
    }();
  });
