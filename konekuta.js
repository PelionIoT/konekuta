'use strict';

var mbed = require('./mbed-cloud-sdk');
var co = require('co');
var assert = require('assert');
var EventEmitter = require('events');
var KonekutaHelpers = require('./helpers');

var CON_PREFIX = '\x1b[34m[Konekuta]\x1b[0m';

module.exports = function(options, callback) {

  var ee = new EventEmitter();

  assert.equal(typeof options, 'object', 'Need to pass in options as first argument');

  options.token = process.env.TOKEN || options.token;
  if (!options.token || options.token === 'YOUR_ACCESS_TOKEN') {
    return callback('Please set your access token first!');
  }

  if (options.io) {
    assert.equal(typeof options.io, 'object', 'Need to pass in socket.io instance under options.io');
  }
  if (!options.ignoreEndpointType) {
    assert(options.endpointType, 'Need to pass in options.endpointType');
  }
  else {
    options.endpointType = null;
  }
  assert.equal(typeof options.mapToView, 'function', 'Need to pass in options.mapToView');
  assert.equal(typeof callback, 'function', 'Need to pass in callback as second argument');

  for (let prop of Object.keys(options.deviceModel)) {
    if (options.deviceModel[prop].subscribe === true) {
      options.deviceModel[prop].subscribe = options.deviceModel[prop].retrieve;
    }

    let o = options.deviceModel[prop].update;
    if (o) {
      if (typeof o !== 'object') return callback(`options.deviceModel.${prop}.update should be an object`);
      if (['put', 'post'].indexOf(o.method) === -1) {
        return callback(`options.deviceModel.${prop}.update.method should be 'put' or 'post'`);
      }
      if (!o.path) {
        return callback(`options.deviceModel.${prop}.update.path is missing`);
      }
    }
  }

  function getPropFromDeviceModel(prop) {
    return Object.keys(options.deviceModel)
    .filter(k => !!options.deviceModel[k][prop])
    .reduce((curr, k) => {
      curr[k] = options.deviceModel[k][prop];
      return curr;
    }, {});
  }

  let subscribe = getPropFromDeviceModel('subscribe');
  let retrieve = getPropFromDeviceModel('retrieve');
  let update = getPropFromDeviceModel('update');

  options.timeout = options.timeout || (7000 + (Object.keys(subscribe).length * 3000));

  // This is the truth. This is where we keep state of all connected devices.
  var devices = [];

  var api = new mbed.ConnectApi({
    apiKey: options.token,
    host: options.host
  });

  var deviceApi = new mbed.DeviceDirectoryApi({
    apiKey: options.token,
    host: options.host
  });

  var helpers = new KonekutaHelpers(api, deviceApi, { verbose: options.verbose });

  var updateValue = co.wrap(function*(endpoint, propertyName, newvalue, socket, callback) {
    options.verbose && console.log(CON_PREFIX, 'change-' + propertyName, endpoint, newvalue);
    try {
      var device = devices.filter(d => d.endpoint === endpoint)[0];
      if (!device) throw 'Could not find device with endpoint ' + endpoint;

      if (!options.dontUpdate) {
        let method = update[propertyName].method === 'put' ?
          'setResourceValue' :
          'executeResource';
        yield api[method](endpoint, update[propertyName].path, newvalue.toString());
      }

      options.verbose && console.log(CON_PREFIX, `change-${propertyName} OK`, endpoint);
      device[propertyName] = newvalue;

      // broadcast to other clients
      if (!options.dontBroadcastLocalUpdates) {
        if (socket) {
          console.log(CON_PREFIX, 'sending over normal socket');
          socket.broadcast.emit(`change-${propertyName}`, endpoint, newvalue);
        }
        else if (options.io) {
          console.log(CON_PREFIX, 'broadcasting', propertyName);
          options.io.sockets.emit(`change-${propertyName}`, endpoint, newvalue);
        }
      }

      ee.emit('change', device, propertyName, newvalue, 'websocket');
      ee.emit('change-' + propertyName, device, newvalue, 'websocket');

      callback && callback();
    }
    catch (err) {
      options.verbose && console.log(CON_PREFIX, `change-${propertyName} failed`, endpoint, err);
      callback && callback(err.toString());
    }
  });

  // Subscribe to resources and get initial values for a device
  function getDeviceData(endpoint, type) {
    let s = Object.keys(subscribe).map(k => subscribe[k]);

    return helpers.getResources(endpoint, s, retrieve, options.timeout).catch(err => {
      options.verbose && console.log(CON_PREFIX, 'error when retrieving values for', endpoint, err);
      // don't throw, but rather capture the error...
      return {
        endpoint: endpoint,
        endpointType: type,
        err: err
      };
    }).then(device => {
      if (device.err) return device;

      for (let key of Object.keys(update)) {
        let capitalized = key.substr(0, 1).toUpperCase() + key.substr(1);
        device['update' + capitalized] = function(newvalue, callback) {
          updateValue(device.endpoint, key, newvalue, null, callback);
        };
      }

      device.endpointType = type;

      return device;
    }).catch(err => {
      console.error(CON_PREFIX, 'getDeviceData failed', err);
    });
  }

  // Gets the initial batch of devices...
  function* getDevices() {
    let devices = yield helpers.getEndpoints(options.endpointType);

    if (options.verbose) {
      let toprint = devices.map(device => {
        return Object.keys(device).reduce((curr, k) => {
          if (k !== '_api' && typeof device[k] !== 'undefined') curr[k] = device[k];
          return curr;
        }, {});
      });
      console.log(CON_PREFIX, 'got devices', toprint);
    }

    let getDeviceDatas = devices.map(device => getDeviceData(device.endpoint, device.type));

    let data = yield Promise.all(getDeviceDatas);

    // so data is now an array with objects which contains { endpoint, status, intensity, ip }
    return data;
  }

  // socket.io
  options.io && options.io.on('connection', function(socket) {
    // sync all devices to the client to verify that he has latest version
    let sync = devices.map(d => {
      return { endpoint: d.endpoint, view: options.mapToView(d) };
    });
    socket.emit('device-list', sync);

    for (let name of Object.keys(update)) {
      socket.on('change-' + name, (endpoint, newvalue, callback) => {
        updateValue(endpoint, name, newvalue, socket, callback);
      });
    }

  });

  // Start notification channel
  api.startNotifications(co.wrap(function*(err) {
    if (err) {
      return callback('Connection to mbed Cloud failed ' + err);
    }

    try {

      options.verbose && console.log(CON_PREFIX, 'connected to mbed Cloud, retrieving initial device model');

      if (options.fakeData) {
        devices = options.fakeData;
      }
      else {
        // get all current devices, subscribe to their resources, and retrieve initial values
        devices = yield getDevices();
      }

      if (devices.some(d => d.err)) {
        options.verbose && console.log(CON_PREFIX, 'devices with errors:', devices.filter(d => d.err));
      }

      devices = devices.filter(d => !d.err);

      if (options.subscribeToAllResources) {
        yield helpers.subscribeToAllResources(devices.map(d => d.endpoint));
      }

      callback(null, devices, ee, api);

      if (devices.some(d => d.err)) {
        ee.emit('devices-with-errors', devices.filter(d => d.err));
      }

    }
    catch (ex) {
      return callback('Loading initial device model failed ' + ex);
    }
  }));

  // Notifications
  api.on('notification', function(notification) {
    let device = devices.filter(d => d.endpoint === notification.id)[0];
    if (!device) {
      // console.error('Got notification for non-existing device...', notification);
      return;
    }

    options.verbose && console.log(CON_PREFIX, 'notification', notification);

    let prop = Object.keys(subscribe).filter(k => {
      return subscribe[k] === notification.path;
    })[0];

    // should not happen but hey
    if (!prop) {
      ee.emit('notification-unmapped-route', device, notification.path, notification.payload);
      if (!options.subscribeToAllResources) {
        console.error(CON_PREFIX, 'notification for non-mapped route...', notification);
      }
      return;
    }

    // can intercept from your main app :-)
    ee.emit('change', device, prop, notification.payload, 'notification');
    ee.emit('change-' + prop, device, notification.payload, 'notification');

    device[prop] = notification.payload;
    options.io && options.io.sockets.emit('change-' + prop, notification.id, notification.payload);

    if (options.verbose) {
      var toprint = Object.keys(device).reduce((curr, k) => {
        if (typeof device[k] !== 'function') curr[k] = device[k];
        return curr;
      }, {});

      console.log(CON_PREFIX, 'updated device', toprint);
    }
  });

  api.on('registration', co.wrap(function*(registration) {
    if (!options.ignoreEndpointType && registration.type !== options.endpointType) return;

    ee.emit('new-registration', registration);

    let device = devices.filter(d => d.endpoint === registration.id)[0];
    if (device) {
      console.warn(CON_PREFIX, 'registration came in for device that already existed...');
      // so do de-register now, and then register again...
      api.emit('de-registration', registration);
    }

    let data = yield getDeviceData(registration.id, registration.type);

    if (options.subscribeToAllResources) {
      yield helpers.subscribeToAllResources([ registration.id ]);
    }

    if (data.err) {
      ee.emit('create-device-error', registration.id, data.err);
      options.verbose && console.log(CON_PREFIX, 'loading device model for', registration.id, 'failed', data.err);
      return;
    }

    devices.push(data);

    ee.emit('created-device', data);

    options.io && options.io.sockets.emit('created-device', options.mapToView(data));
  }));

  function deregister(registration) {
    registration = typeof registration === 'object' ? registration : { id: registration };

    let device = devices.filter(d => d.endpoint === registration.id)[0];
    if (!device) {
      return options.verbose && console.log(CON_PREFIX, 'de-registration came in for non-tracked device...', registration);
    }
    devices.splice(devices.indexOf(device), 1);

    ee.emit('removed-device', registration.id);

    options.io && options.io.sockets.emit('removed-device', registration.id);
  }

  api.on('deregistration', deregister);

  api.on('expired', deregister);

};
