angular
  .module('rpg')
  .config([
    '$qProvider',
    '$resourceProvider',
  function(
    $qProvider,
    $resourceProvider
  ) {
    $qProvider.errorOnUnhandledRejections(false);

    $resourceProvider.defaults.cancellable = true;
  }])
  .service('RestfulService', [
    '$resource',
  function(
    $resource
  ) {
    return function(url, paramDefaults, actions) {
      if (_.isArray(actions)) {
        var updated = {};

        _.forEach(actions, function(action) {
          updated[action] = {
            'method': 'POST',
            'params': {
              'action': action
            }
          }
        });

        actions = updated;
      }

      var resource = $resource.apply($resource, [url, paramDefaults, actions]);

      resource.requests = resource.requests || {};

      resource.abort = function(method) {
        if (method && resource.requests[method]) {
          resoure.requests[method].$cancelRequest();

          delete resource.requests[method];
        } else {
          _.invokeMap(resource.requests, '$cancelRequest');

          resource.requests = {};
        }

        return resource;
      };

      _.forEach(_.keys(actions), function(method) {
        var original = resource[method];

        if (_.isFunction(original)) {
          resource[method] = function() {
            resource.requests[method] = original.apply(resource, arguments);

            return resource.requests[method].$promise;
          };
        }
      });

      return resource;
    }
  }]);
