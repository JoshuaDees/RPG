angular
  .module('rpg')
  .directive('overlay', function() {
    return {
      'constrain': 'A',
      'link': function($scope, $element, $attributes) {
        $scope.$watchGroup([
          $attributes.overlay,
          $attributes.overlayText
        ], function(options) {
          $element.find('> .overlay').remove();

          if (options[0]) {
            $element.append('<div class="overlay"><span class="message">' + (options[1] || 'Loading...') + '</span></div>');
          }
        });
      }
    };
  });
