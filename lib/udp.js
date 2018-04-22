const {
  curry, forEach, isEmpty, isString, map,
} = require('lodash/fp')
const { hasBroadcastProp } = require('./utils')
const { closeSocket, openSocket } = require('./udp-socket')

// STOP.

// Unsubscribe individual listener.
const unsubscribe = curry((app, { eventId, listener }) =>
  app.removeListener(eventId, listener))

// Unsubscribe all listeners from app.
function unsubscribeFromApp(app) {
  app.debug('unsubscribeFromApp')
  const listeners = app.ref.get('subscriptions')
  if (isEmpty(listeners)) return
  forEach(unsubscribe(app), listeners)
  app.ref.set('subscriptions', null)
}

const ensureSocketClosed = (app) => {
  app.debug('ensureSocketClosed')
  const socket = app.ref.get('socket')
  return socket ? closeSocket(app) : Promise.resolve()
}

const stopUdp = app => () => {
  unsubscribeFromApp(app)
  return ensureSocketClosed(app)
    // Clear plugin state.
    .then(() => app.ref.clear())
}

// START.
const singleTrailingNewline = data => `${data.replace(/(\r?\n)*$/, '')}\r\n`
// Send data to a specific UDP port and host.
const sendData = curry((app, { port, hostname }, data) => new Promise((resolve) => {
  const packet = isString(data) ? singleTrailingNewline(data) : data
  // Does it need a try catch if it has an error handler function?
  // socket.send(msg, [offset, length,] port [, address] [, callback])
  app.ref.get('socket').send(packet, 0, packet.length, port, hostname, (err) => {
    if (err) {
      app.error(err)
      return resolve(err) // Is this resolve/reject going to cause problems somewhere?
    }
    app.debug(`Sent data to ${hostname}:${port}`)
    return resolve()
  })
}))

// Create a listener function based on port and host and associate with eventId.
const getListener = curry((app, props) => ({
  listener: sendData(app, props),
  eventId: props.eventId,
}))

// Subscribe to event with listener.
const subscribe = curry((app, { eventId, listener }) =>
  app.on(eventId, listener))

// Subscribe all listeners to app.
const subscribeToApp = (app, props) => () => {
  // Make a list of listeners based on valid props that can be used to subscribe/unsubscribe.
  app.ref.set('subscriptions', map(getListener(app), props))
  // Now subscribe them all.
  forEach(subscribe(app), app.ref.get('subscriptions'))
}

// Props is an array of UDP event watcher/dispatcher defintion objects.
// See `udp` in schema.js for schema of prop item.
function startUdp(app, props) {
  // All are currently TX only.
  return openSocket(app, { broadcast: hasBroadcastProp(props) })
    .then(subscribeToApp(app, props))
}

module.exports = {
  sendData,
  startUdp,
  stopUdp,
  subscribe,
}
