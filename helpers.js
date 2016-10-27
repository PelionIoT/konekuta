'use strict';

var co = require('co');
var promisify = require('es6-promisify');

function KonekutaHelpers(connector, options) {
  // options should contain { verbose }

  this.connector = connector;
  this.options = options;
}

KonekutaHelpers.prototype.getResources = function(endpoint, subscriptions, resourceValues, timeout) {
  timeout = timeout || 10000;

  let api = this.connector;
  let options = this.options;

  return new Promise((res, rej) => {
    var cancel = false;

    var to = setTimeout(() => {
      cancel = true;
      rej('Timeout when retrieving values');
    }, timeout);

    co.wrap(function*() {
      // we need to run this in series...
      let ret = {
        endpoint: endpoint
      };

      // first subscribe
      for (let path of subscriptions) {
        if (cancel) return;

        yield promisify(api.putResourceSubscription.bind(api))(endpoint, path);
        options.verbose && console.log('subscribed to', endpoint, path);
      }

      // then fix resources
      for (let key of Object.keys(resourceValues)) {
        if (cancel) return;

        ret[key] = yield promisify(api.getResourceValue.bind(api))(endpoint, resourceValues[key]);
        options.verbose && console.log('got value', endpoint, key, resourceValues[key], '=', ret[key]);
      }

      clearTimeout(to);

      return ret;
    })().then(res, rej);
  });
};

// promisified version of api.getEndpoints
KonekutaHelpers.prototype.getEndpoints = function(type) {
  let typeRegex;
  if (type instanceof RegExp) {
    typeRegex = type;
    type = null;
  }
  
  let api = this.connector;
  let opts = type ? { parameters: { type: type } } : null;

  return new Promise((res, rej) => {
    api.getEndpoints((err, devices) => {
      if (err) return rej(err);
      devices = devices.map(d => {
        d.endpoint = d.name;
        return d;
      });
      
      console.log('types is', devices, typeRegex);
      
      if (typeRegex) {
        devices = devices.filter(d => {
          console.log(d.type, typeRegex.test(d.type));
          
          return typeRegex.test(d.type);
        });
      }
      
      res(devices);
    }, opts);
  });
};

KonekutaHelpers.prototype.putResourceSubscription = function(endpoint, r) {
  let api = this.connector;
  let verbose = this.options.verbose;

  return new Promise((res, rej) => {
    api.putResourceSubscription(endpoint, r, function(err) {
      if (err) verbose && console.error('subscribe error', endpoint, r, err);
      verbose && console.log('subscribed to', endpoint, r);
      if (err) return rej(err);
      setTimeout(() => {
        res();
      }, 1500);
    });
  });
};

KonekutaHelpers.prototype.subscribeToAllResources = co.wrap(function*(endpoints) {
  let self = this;
  let api = this.connector;
  let verbose = this.options.verbose;

  var allResources = yield Promise.all(endpoints.map(e => {
    return promisify(api.getResources.bind(api))(e);
  }));

  allResources = allResources.map(r => r.filter(a => a.obs).map(a => a.uri));

  yield Promise.all(allResources.map((resources, rix) => {
    let endpoint = endpoints[rix];

    return co.wrap(function*() {
      try {
        for (let r of resources) {
          verbose && console.log('subscribing to', endpoint, r);
          yield self.putResourceSubscription(endpoint, r);
        }
      }
      catch (ex) {
        verbose && console.error('Error...', ex.toString());
      }
    })();
  }));

});

module.exports = KonekutaHelpers;
