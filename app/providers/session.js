angular
  .module('rpg')
  .factory('SessionProvider', [function() {
    return new function() {
      this.set = function(key, value) {
        return sessionStorage.setItem(key, value);
      };

      this.get = function(key) {
        return sessionStorage.getItem(key);
      };

      this.remove = function(key) {
        return sessionStorage.removeItem(key);
      };
    }
  }])
