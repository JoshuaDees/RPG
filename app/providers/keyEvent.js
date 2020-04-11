angular
  .module('rpg')
  .factory('KeyEventProvider', function() {

    return new function() {
      this.actions = [];

      this.$handleEvent = function($event) {
        var str, match;

        _.forEach(this.actions, function(action) {
          _.forEach(action.matches, function(regex) {
            str = stringify($event);
            match = str.match(new RegExp('^' + regex + '$'))

            if (match && match[0] && str == match[0]) {
              action.callback(match[0]);
            }
          })
        });

        if (stringify($event).match(/(Shift\+)?Escape/)) {
          $('#error').remove();
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

      $(document).on('keydown', function($event) {
        KeyEventProvider.$handleEvent($event);
      });
    }();
  });
