'use strict';

var co = require('co');
var promisify = require('es6-promisify');

function KonekutaHelpers(connector, options) {
  // options should contain { verbose }

  this.connector = connector;
  this.options = options;
}

KonekutaHelpers.prototype.getResources = function(endpoint, subscriptions, resourceValues) {
  let api = this.connector;
  let options = this.options;

  return co.wrap(function*() {
    // we need to run this in series...
    let ret = {
      endpoint: endpoint
    };

    // first subscribe
    for (let path of subscriptions) {
      yield promisify(api.putResourceSubscription.bind(api))(endpoint, path);
      options.verbose && console.log('subscribed to', endpoint, path);
    }

    // then fix resources
    for (let key of Object.keys(resourceValues)) {
      ret[key] = yield promisify(api.getResourceValue.bind(api))(endpoint, resourceValues[key]);
      options.verbose && console.log('got value', endpoint, key, resourceValues[key], '=', ret[key]);
    }

    return ret;
  })();
};

// promisified version of api.getEndpoints
KonekutaHelpers.prototype.getEndpoints = function(type) {
let api = this.connector;

  return new Promise((res, rej) => {
    api.getEndpoints((err, devices) => {
      if (err) return rej(err);
      devices = devices.map(d => {
        d.endpoint = d.name;
        return d;
      });
      res(devices);
    }, { parameters: { type: type } });
  });
};

module.exports = KonekutaHelpers;
