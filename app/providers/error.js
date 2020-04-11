angular
  .module('rpg')
  .factory('ErrorProvider', [function() {
    return new function() {
      this.alert = function(error) {
        $(document.body).append(
          '<dialog modal id="error">' +
            '<header>' +
              '<a onclick="$(\'#error\').remove();" ui-sref><i class="fa fa-times"></i></a>' +
              'Error' +
            '</header>' +
            '<main>' + error + '</main>' +
            '<footer><button onclick="$(\'#error\').remove();" type="submit">Close</button></footer>' +
          '</dialog>'
        );

        $('#error')[0].showModal();
      };
    }
  }])
