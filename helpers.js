'use strict';

var co = require('co');

var CON_PREFIX = '\x1b[34m[Konekuta]\x1b[0m';

function KonekutaHelpers(connector, deviceApi, options) {
  // options should contain { verbose }

  this.connector = connector;
  this.deviceApi = deviceApi;
  this.options = options;
}

KonekutaHelpers.prototype.getResources = function(endpoint, subscriptions, resourceValues, timeout) {
  timeout = timeout || 10000;

  let api = this.connector;
  let deviceApi = this.deviceApi;
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

      // first receive the device
      let cloudDevice = yield deviceApi.getDevice(endpoint);

      for (let prop of Object.keys(cloudDevice)) {
        if (prop === '_api') continue;
        if (cloudDevice[prop]) {
          ret[prop] = cloudDevice[prop];
        }
      }
      options.verbose && console.log(CON_PREFIX, 'retrieved full device model', endpoint);

      // first subscribe
      for (let path of subscriptions) {
        if (cancel) return;

        yield api.addResourceSubscription(endpoint, path);
        options.verbose && console.log(CON_PREFIX, 'subscribed to', endpoint, path);
      }

      // then fix resources
      for (let key of Object.keys(resourceValues)) {
        if (cancel) return;

        ret[key] = yield api.getResourceValue(endpoint, resourceValues[key]);
        options.verbose && console.log(CON_PREFIX, 'got value', endpoint, key, resourceValues[key], '=', ret[key]);
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

  return new Promise((res, rej) => {
    let filter = { deviceType: { $eq: 'light-system' } };
    api.listConnectedDevices({ filter: filter }, (err, resp) => {
      if (err) return rej(err);

      let devices = resp.data;

      devices = devices.map(d => {
        d.endpoint = d.id;
        return d;
      });

      if (typeRegex) {
        devices = devices.filter(d => {
          console.log(CON_PREFIX, d.type, typeRegex.test(d.type));

          return typeRegex.test(d.type);
        });
      }

      res(devices);
    });
  });
};

KonekutaHelpers.prototype.putResourceSubscription = function(endpoint, r) {
  let api = this.connector;
  let verbose = this.options.verbose;

  return new Promise((res, rej) => {
    api.putResourceSubscription(endpoint, r, function(err) {
      if (err) verbose && console.error(CON_PREFIX, 'subscribe error', endpoint, r, err);
      verbose && console.log(CON_PREFIX, 'subscribed to', endpoint, r);
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
    return api.listDeviceResources({ id: e });
  }));

  allResources = allResources.map(r => r.filter(a => a.obs).map(a => a.uri));

  yield Promise.all(allResources.map((resources, rix) => {
    let endpoint = endpoints[rix];

    return co.wrap(function*() {
      try {
        for (let r of resources) {
          verbose && console.log(CON_PREFIX, 'subscribing to', endpoint, r);
          yield self.putResourceSubscription(endpoint, r);
        }
      }
      catch (ex) {
        verbose && console.error(CON_PREFIX, 'error subscribing to...', endpoint, ex.toString());
      }
    })();
  }));

});

module.exports = KonekutaHelpers;
