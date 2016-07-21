# Konekuta

A highly-opiniated node.js framework to quickly build dynamic web-applications on top of mbed Device Connector.

The idea behind Konekuta is that for many applications you need to solve the same problems:

* Keeping state consistent, both between Connector and your app, but also between connected clients.
* Have a fault-tolerant way of sending updates to a device, and keeping the UI sane whenever an update fails.
* Don't overload Connector by retrieving values from it on every page load.

Konekuta handles this by:

* Loading the total state of all your devices only once, on app startup.
* Properly handling registrations / de-registrations and notifications from mbed Device Connector.
* A persistent web socket that syncs state between all connected clients, which will also correct state whenever a client re-connects.
* Standardized way of handling updates, including callbacks whenever updates fail, so you can show proper feedback to the user.

The framework is not flexible. It makes a bunch of assumptions on your environment and usage which might not fit you. This is by design. If your usecase does not fit Konekuta, use the [mbed Connector node.js library](https://github.com/ARMmbed/mbed-connector-api-node) instead.

An example application is available here: [ARMmbed/connected-lights](https://github.com/ARMmbed/connected-lights/tree/master/webapp).

## Usage

First add both Konekuta and socket.io to your application:

```
$ npm install konekuta socket.io --save
```

You'll also need a web server (like express) and probably a templating library (like hbs) to serve content. You're free to make your own choices here though.

To get started:

```js
var konekuta = require('konekuta');

konekuta({
  endpointType: 'Luminaire', // Endpoint type for your devices
  token: 'aabbcc',           // Access token for Connector
  io: io,                    // socket.io instance
  subscribe: {
    status: '/6002/0/4',     // Which resources to subscribe to. local name, and connector path, will get updated by notifications
    intensity: '/6002/0/5',
  },
  retrieve: {
    status: '/6002/0/4',    // Which resources to retrieve on app startup (make sure to use same names as under subscribe). Will also be retrieved whenever a new device registers.
    intensity: '/6002/0/5',
    ip: 'IPv6/0/Address',
  },
  updates: {
    status: {               // How to update resources. Use the same names as before.
      method: 'post',       // Automatically creates socket.io routes under 'change-status' which you can write to to update the resource.
      path: '/6002/0/101',
    },
    intensity: {
      method: 'post',
      path: '/6002/0/102'
    },
  },
  mapToView: mapToView,     // A function which maps a device -> view model, which you can use in your web app
  verbose: true,            // Verbose logging
  dontUpdate: false,        // If true, will not PUT or POST to Connector
  fakeData: null            // Put an array here with fake details, library will then not actually query Connector. Useful for development.

}, function(devices, ee) {
   // this would be a good moment to start your web server

   // devices contains all devices, already synced up with device connector
   // ee is an EventEmitter, which you can use to get access to notifications
});
```
