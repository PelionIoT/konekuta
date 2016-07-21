'use strict';

var CloudApi = require('mbed-connector-api');
var promisify = require('es6-promisify');
var co = require('co');
var assert = require('assert');
var EventEmitter = require('events');

module.exports = function(options, callback) {

  var ee = new EventEmitter();

  assert.equal(typeof options, 'object', 'Need to pass in options as first argument');

  options.token = process.env.TOKEN || options.token;
  if (!options.token || options.token === 'YOUR_ACCESS_TOKEN') {
    return callback('Please set your access token first!');
  }

  assert(options.io, 'Need to pass in socket.io instance under options.io');
  assert(options.endpointType, 'Need to pass in options.endpointType');
  assert.equal(typeof options.mapToView, 'function', 'Need to pass in options.mapToView');
  assert.equal(typeof callback, 'function', 'Need to pass in callback as second argument');

  if (options.dontUpdate) {
    console.log(`Starting in 'dont-update' mode, not syncing changes back to mbed Cloud`);
  }

  options.subscribe = options.subscribe || {};
  options.retrieve = options.retrieve || {};
  options.updates = options.updates || {};

  for (let updateKey of Object.keys(options.updates)) {
    let o = options.updates[updateKey];
    if (typeof o !== 'object') return callback(`options.updates.${updateKey} should be an object`);
    if (['put', 'post'].indexOf(o.method) === -1) {
      return callback(`options.updates.${updateKey}.method should be 'put' or 'post'`);
    }
    if (!o.path) {
      return callback(`options.updates.${updateKey}.path is missing`);
    }
  }

  // This is the truth. This is where we keep state of all connected devices.
  var devices = [];

  var api = new CloudApi({
    accessKey: options.token
  });

  function getResources(endpoint, subscriptions, resourceValues) {
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
  }

  // promisified version of api.getEndpoints
  function getEndpoints(type) {
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
  }

  // Subscribe to resources and get initial values for a device
  function getDeviceData(endpoint) {
    let subscribe = Object.keys(options.subscribe).map(k => options.subscribe[k]);

    return getResources(endpoint, subscribe, options.retrieve || {}).catch(err => {
      options.verbose && console.log('error when retrieving values for', endpoint, err);
      // don't throw, but rather capture the error...
      return { err: err };
    });
  }

  // Gets the initial batch of devices...
  function* getDevices() {
    let devices = yield getEndpoints(options.endpointType);

    options.verbose && console.log('got devices', devices);

    let getDeviceDatas = devices.map(device => getDeviceData(device.endpoint));

    let data = yield Promise.all(getDeviceDatas);
    options.verbose && console.log('errors:', data.filter(m => m.err));

    // so data is now an array with objects which contains { endpoint, status, intensity, ip }
    return data;
  }

  // socket.io
  options.io.on('connection', function(socket) {
    // sync all devices to the client to verify that he has latest version
    let sync = devices.map(d => {
      return { endpoint: d.endpoint, view: options.mapToView(d) };
    });
    socket.emit('device-list', sync);

    for (let name of Object.keys(options.updates)) {

      socket.on('change-' + name, co.wrap(function*(endpoint, newvalue, callback) {
        options.verbose && console.log('change-' + name, endpoint, newvalue);
        try {
          var device = devices.filter(d => d.endpoint === endpoint)[0];
          if (!device) throw 'Could not find device with endpoint ' + endpoint;

          if (!options.dontUpdate) {
            let method = options.updates[name].method === 'put' ?
              'putResourceValue' :
              'postResource';
            yield promisify(api[method].bind(api))(endpoint, options.updates[name].path, newvalue.toString());
          }

          options.verbose && console.log(`change-${name} OK`, endpoint);
          device[name] = newvalue;

          // broadcast to other clients
          if (!options.dontBroadcastLocalUpdates) {
            socket.broadcast.emit(`change-${name}`, endpoint, newvalue);
          }

          callback && callback();
        }
        catch (err) {
          options.verbose && console.log(`change-${name} failed`, endpoint, err);
          callback && callback(err.toString());
        }
      }));

    }

  });

  // Start notification channel
  api.startLongPolling(co.wrap(function*(err) {
    if (err) {
      return callback('Connection to mbed Cloud failed ' + err);
    }

    console.log('Retrieving initial device model...');

    if (options.fakeData) {
      devices = options.fakeData;
    }
    else {
      // get all current devices, subscribe to their resources, and retrieve initial values
      devices = yield getDevices();
    }

    if (devices.some(d => d.err)) {
      console.log('Devices with errors:', devices.filter(d => d.err));
    }

    devices = devices.filter(d => !d.err);

    console.log('Retrieved %d devices on startup', devices.length, devices);

    callback(null, devices, ee, api);
  }));

  // Notifications
  api.on('notification', function(notification) {
    let device = devices.filter(d => d.endpoint === notification.ep)[0];
    if (!device) {
      // console.error('Got notification for non-existing device...', notification);
      return;
    }

    options.verbose && console.log('notification', notification);

    let prop = Object.keys(options.subscribe).filter(k => {
      return options.subscribe[k] === notification.path;
    })[0];

    // should not happen but hey
    if (!prop) return console.error('Notification for non-mapped route...', notification);

    // can intercept from your main app :-)
    ee.emit('notification-' + prop, device, notification.payload);

    device[prop] = notification.payload;
    options.io.sockets.emit('change-' + prop, notification.ep, notification.payload);

    options.verbose && console.log('updated device', device);
  });

  api.on('registration', co.wrap(function*(registration) {
    if (registration.ept !== options.endpointType) return;

    console.log('new registration', registration, devices);

    let device = devices.filter(d => d.endpoint === registration.ep)[0];
    if (device) {
      console.warn('Registration came in for device that already existed...');
      // so do de-register now, and then register again...
      api.emit('de-registration', registration);
    }

    let data = yield getDeviceData(registration.ep);

    devices.push(data);

    console.log('new registration data', data);

    options.io.sockets.emit('created-device', options.mapToView(data));
  }));

  function deregister(registration) {
    if (registration.ept !== options.endpointType) return;

    let device = devices.filter(d => d.endpoint === registration.ep)[0];
    if (!device) {
      console.error('de-registration came in for non-existing device...', registration);
    }
    devices.splice(devices.indexOf(device), 1);

    console.log('de-registered', registration);
    options.io.sockets.emit('removed-device', registration.ep);
  }

  api.on('de-registration', deregister);

  api.on('registration-expired', deregister);

};
