angular
  .module('rpg')
  .controller('RPGController', [
    '$scope',
    '$state',
    'FocusProvider',
    'KeyEventProvider',
    'SessionProvider',
  function(
    $scope,
    $state,
    FocusProvider,
    KeyEventProvider,
    SessionProvider
  ) {
    if (SessionProvider.get('userId')) {
      $state.transitionTo('games.menu');
    } else {
      $state.transitionTo('users.login');
    }

    $scope.transitionTo = function(state, params) {
      $state.transitionTo(state, params);
    };

    $(function() {
      function zoom() {
        //return;

        var height = 540;
        var width = 960;

        var maxHeight = $(document.body).innerHeight();
        var maxWidth = $(document.body).innerWidth();

        var dh = maxHeight / height;
        var dw = maxWidth / width;

        var d = dh <= dw ? dh : dw;

        $('.container').css('zoom', d);
      }

      $(window).on('resize', zoom);

      zoom();
    });
  }]);
