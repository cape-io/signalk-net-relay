const dgram = require('dgram')
const {
  curry, forEach, map,
} = require('lodash/fp')

// Setup a socket and save to state.
function createSocket(app, { broadcast = false }) {
  try {
    console.log('socket send creating')

    const socket = dgram.createSocket('udp4')
    // Only when broadcast is set.
    if (broadcast) socket.bind(() => { socket.setBroadcast(true) })
    // Save state.
    app.ref.set('socket', socket)
    console.log('socket push created')
    app.set('started', true)
  } catch (error) {
    app.error(error)
    app.set('errMsg', error.message)
    app.set('started', false)
  }
}

// Send data to a specific UDP port and host.
const sendData = (app, { port, hostname }, data) => {
  // Does it need a try catch if it has an error handler function?
  // socket.send(msg, [offset, length,] port [, address] [, callback])
  app.ref.get('socket').send(data, 0, data.length, port, hostname, (err) => {
    if (err) app.error(err)
  })
}

// Create a listener function based on port and host and associate with eventId.
const getListener = curry((app, props) => ({
  listener: sendData(app, props),
  eventId: props.eventId,
}))

// Subscribe to event with listener.
const subscribe = curry((app, { eventId, listener }) =>
  app.on(eventId, listener))

// Props is an array of UDP event watcher/dispatcher defintion objects. See udp in schema.js
function startUdp(app, props) {
  // console.log(app)
  createSocket(app, {})
  // Make a list of listeners based on valid props that can be used to subscribe/unsubscribe.
  app.ref.set('subscriptions', map(getListener(app), props))
  // Now subscribe them all.
  forEach(subscribe(app), app.ref.get('subscriptions'))
}

const unsubscribe = curry((app, { eventId, listener }) =>
  app.removeListener(eventId, listener))

function stopUdp(app) {
  // Exclude the socket from the reference counting that keeps the Node.js process active.
  app.ref.get('socket').unref()
  // Unsubscribe all.
  forEach(unsubscribe(app), app.ref.get('subscriptions'))
  // Clear all our state.
  app.ref.clear()
  app.set('stopped', true)
}

module.exports = {
  sendData,
  startUdp,
  stopUdp,
  subscribe,
}
