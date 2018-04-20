const {
  curry, forEach, isEmpty, map,
} = require('lodash/fp')
const { hasBroadcastProp } = require('./utils')
const { createSocket } = require('./udp-socket')

// STOP.

// Unsubscribe individual listener.
const unsubscribe = curry((app, { eventId, listener }) =>
  app.removeListener(eventId, listener))

// Unsubscribe all listeners from app.
function unsubscribeFromApp(app) {
  const listeners = app.ref.get('subscriptions')
  if (isEmpty(listeners)) return
  forEach(unsubscribe(app), listeners)
}

const stopUdp = app => () => {
  unsubscribeFromApp(app)
  app.ref.invoke('socket.close') // Should fail silently if socket already removed itself.
  app.ref.clear() // Clear plugin state.
}

// START.

// Send data to a specific UDP port and host.
const sendData = curry((app, { port, hostname }, data) => {
  // Does it need a try catch if it has an error handler function?
  // socket.send(msg, [offset, length,] port [, address] [, callback])
  app.ref.get('socket').send(data, 0, data.length, port, hostname, (err) => {
    if (err) app.error(err)
  })
})

// Create a listener function based on port and host and associate with eventId.
const getListener = curry((app, props) => ({
  listener: sendData(app, props),
  eventId: props.eventId,
}))

// Subscribe to event with listener.
const subscribe = curry((app, { eventId, listener }) =>
  app.on(eventId, listener))

// Props is an array of UDP event watcher/dispatcher defintion objects.
// See `udp` in schema.js for schema of prop item.
function startUdp(app, props) {
  // All are currently TX only.
  createSocket(app, { broadcast: hasBroadcastProp(props) })
  // Make a list of listeners based on valid props that can be used to subscribe/unsubscribe.
  app.ref.set('subscriptions', map(getListener(app), props))
  // Now subscribe them all.
  forEach(subscribe(app), app.ref.get('subscriptions'))
}

module.exports = {
  sendData,
  startUdp,
  stopUdp,
  subscribe,
}
