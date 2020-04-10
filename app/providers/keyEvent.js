angular
  .module('rpg')
  .factory('KeyEventProvider', function() {

    return new function() {
      this.actions = [];

      this.$handleEvent = function($event) {
        _.forEach(this.actions, function(action) {
          if (stringify($event).match(action.matches)) {
            action.callback($event);
          }
        });

        if (stringify($event).match(/(Shift\+)?Escape/)) {
          $event.preventDefault();
        }
      };

      function stringify($event) {
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
      }

      var KeyEventProvider = this;

      $(document).on('keydown keyup keypress', function($event) {
        KeyEventProvider.$handleEvent($event);
      });
    }();
  });
