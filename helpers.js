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
        get endpoint() {
          return endpoint;
        }
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
