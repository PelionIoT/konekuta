# Konekuta

A highly-opiniated node.js framework to quickly build dynamic web-applications on top of mbed Cloud.

The idea behind Konekuta is that for many applications you need to solve the same problems:

* Keeping state consistent, both between Connector and your app, but also between connected clients.
* Have a fault-tolerant way of sending updates to a device, and keeping the UI sane whenever an update fails.
* Don't overload Connector by retrieving values from it on every page load.

Konekuta handles this by:

* Loading the total state of all your devices only once, on app startup.
* Properly handling registrations / de-registrations and notifications from mbed Cloud.
* A persistent web socket that syncs state between all connected clients, which will also correct state whenever a client re-connects.
* Standardized way of handling updates, including callbacks whenever updates fail, so you can show proper feedback to the user.

The framework is not flexible. It makes a bunch of assumptions on your environment and usage which might not fit you. This is by design. If your usecase does not fit Konekuta, use the [mbed Cloud JavaScript SDK](https://github.com/ARMmbed/mbed-cloud-sdk-javascript) instead.

Looking for an example app built on top of Konekuta? See [ARMmbed/connected-lights](https://github.com/ARMmbed/connected-lights/tree/master/webapp).

## Installation

First install a recent version of [node.js](https://nodejs.org). Then add both Konekuta and socket.io to your application:

```
$ npm install konekuta socket.io --save
```

You'll also need a web server (like express) and probably a templating library  to serve content. You're free to make your own choices here though.

## Creating a device model

Next, you'll need to define a device model, which maps resources on the physical device to objects. There are three different classes of resources that you can define:

* Retrievable resources - Will be fetched when a device comes online.
* Subscribable resources - Will be subscribed to in mbed Cloud, and thus can be updated from the device.
* Updatable resources - Can be updated from the web application.

For instance, we have a device with these resources:

```
/button/0/count - Number of times a button is pressed
/device/0/name  - Name of the device (can be setted and getted)
/led/0/blink    - Function (POST call) to blink the LED
```

You would map this in Konekuta like this:

```js
{
  buttonCount: {
    retrieve: '/button/0/count',
    subscribe: true                 // pass in a string here to override (true copies over the value of retrieve)
  },
  deviceName: {
    retrieve: '/device/0/name',
    update: {
      method: 'put',
      path: '/device/0/name'
    }
  },
  blink: {
    update: {
      method: 'post',
      path: '/led/0/blink'
    }
  }
}
```

Now when a device registers we first fetch the button count and the device name, we subscribe to the button count, and create functions to blink the LED and update the device name.

This model is shared by both the server and the client.

## Setting up the server

Konekuta has one function:

```js
var konekuta = require('konekuta');

konekuta(options, function(err, devices, ee, connector) {
  // running, start your webserver now

  /* devices is an array which looks like this:
      [
        {
          endpoint: 'f745e447-b26e-43bc-b253-814401e844e3',
          endpointType: 'MyAwesomeLight',
          buttonCount: 3,
          deviceName: 'Light bulb 1',
          updateName: function(newValue, callback) {
            // automatically created for every update'able property
          }
        },
        {
          endpoint: 'ef4ef820-9b3e-4f79-83a1-52aa1bd935fa',
          endpointType: 'MyAwesomeLight',
          buttonCount: 14,
          deviceName: 'Light bulb 2'
        }
      ]
  */
});
```

The options object looks like this:

```js
{
  endpointType: 'MyAwesomeLight',
  token: 'Access token for mbed Cloud',
  io: io,           // socket.io instance
  deviceModel: {},  // see above
  mapToView: function(device) {
    // This is a function which can map the device model (as declared above)
    // to a view model. The view model will be sent to the client when a device
    // connects. So you can add some more info to the object here.
    return device;
  }
}
```

There are some more optional options:

| Name          | Description |
| ------------- |-------------|
| verbose       | Verbose logging. (default: false) |
| host          | The mbed Cloud API host |
| dontUpdate    | When you update a value from a client, do not actually update the value in Cloud. Useful for debugging f.e. lights without constantly triggering the light. (default: false) |
| fakeData      | If you provide an array of devices here, the array will be used, and Connector will be bypassed. Useful for debugging if you don't want to fiddle with actual devices. (default: null) |
| dontBroadcastLocalUpdates | Usually updates are sent to other connected clients. If you already have subscriptions in place for all resources, you can just let Connector handle these notifications. (default: false) |
| timeout | Sometimes resource values cannot be gotten immediately (device is hanging), this is the timeout for getting resource values (default: 7000 ms. + 3000 ms. * number of resources to fetch) |
| ignoreEndpointType | Retrieve all endpoints, regardless of endpoint. Do not combine this with deviceModel, or you'll see plenty of errors. |
| subscribeToAllResources | Lists all resources that are observable, and subscribe to all of them, no need to manually build the device model. |

### Server-side events

The third argument in the callback is `ee`, which is an [EventEmitter](https://nodejs.org/api/events.html). It sends out the following events:

```js
ee.on('new-registration', function(registration) {
  // new device was registered in mbed Cloud, but not loaded device model yet
});

ee.on('created-device', function(device) {
  // device model was loaded for new device
});

ee.on('removed-device', function(endpoint) {
  // device was de-registered from mbed Cloud
});

ee.on('create-device-error', function(endpoint, error) {
  // loading device model for a newly registered device failed
});

ee.on('change', function(device, property, newValue, source) {
  // property on a device was changed
  // source is 'websocket' (changed by a client) or 'notification' (changed in mbed Cloud)
});

ee.on('change-*', function(device, newValue, source) {
  // same as above, but replace * with a property name (e.g. 'change-status')
});

ee.on('devices-with-errors', function(devices) {
  // emitted straight after creation of the EventEmitter,
  // contains all devices for which loading the device model failed
});
```

## Setting up the client

On the client you'll have a web socket (using socket.io) which will stream updates to your application. Here's how you add it to your web app:

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  // Here is how we connect back to the server
  var socket = io.connect(location.origin);

  // Device came online
  socket.on('created-device', function(viewModel) {
    // viewModel contains the result of the 'mapToView' function
    // so you could render HTML already on the server and just add it here
  });

  // Device was deleted, remove it from the UI
  socket.on('deleted-device', function(endpoint) {

  });

  // When connecting to the server, it will send the current list of devices
  // with their values.
  // Useful when you go offline=>online, can sync changes with the server.
  socket.on('device-list', function(list) {
    // list is an array which looks like this:
    /*
      [
        {
          endpoint: 'f745e447-b26e-43bc-b253-814401e844e3',
          view: {
            // whatever you returned in 'mapToView' function
          }
        }
      ]
    */
  });
</script>
```

There are also events for every property that changes on a device. For example, if the `buttonCount` property of a device changes:

```js
// Button count of a device was changed
socket.on('change-buttonCount', function(endpoint, count) {
  // update the UI
});
```

If you want to listen to all `change` events, you can use:

```js
socket.onevent = function(e) {
  if (e.data[0].indexOf('change-') === 0) {
    var property = e.data[0].replace('change-', '');
    var endpoint = e.data[1];
    var newValue = e.data[2];
  }
};
```

### Updating values from the Client

To update the value of a property from the client, call `emit` on the socket:

```js
// the event name is 'change-' + propertyName
// arguments are endpoint, newValue, callback (optional)
socket.emit('change-name', 'f745e447-b26e-43bc-b253-814401e844e3', 'This is the new name', function(err) {
  // callback method, err is filled if something went wrong
});
```
