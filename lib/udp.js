const dgram = require('dgram')
const {
  forEach, map,
} = require('lodash/fp')

// Setup a socket and save to state.
function createSocket(app, state, { broadcast = false }) {
  try {
    const socket = dgram.createSocket('udp4')
    // Only when broadcast is set.
    if (broadcast) socket.bind(() => { socket.setBroadcast(true) })
    // Save state.
    state.set('socket', socket)
    state.set('started', true)
  } catch (error) {
    app.error(error)
    state.set('errMsg', error.message)
    state.set('started', false)
  }
}

// Send data to a specific UDP port and host.
const sendData = (app, state, { port, hostname }) => (data) => {
  // Does it need a try catch if it has an error handler function?
  state.get('socket').send(data, 0, data.length, port, hostname, (err) => {
    if (err) app.error(err)
  })
}

// Create a listener function based on port and host and associate with eventId.
const getListener = (app, state) => props => ({
  listener: sendData(app, state, props),
  eventId: props.eventId,
})

// Subscribe to event with listener.
const subscribe = app => ({ eventId, listener }) => app.on(eventId, listener)
function startUdp(app, state, props) {
  console.log(props)
  createSocket(app, state, {})
  // Make a list of listeners based on valid props that can be used to subscribe/unsubscribe.
  state.set('subscriptions', map(getListener(app, state), props))
  // Now subscribe them all.
  forEach(subscribe(app), state.get('subscriptions'))
}

const unsubscribe = app => ({ eventId, listener }) => app.removeListener(eventId, listener)
function stopUdp(app, state) {
  // Exclude the socket from the reference counting that keeps the Node.js process active.
  state.get('socket').unref()
  // Unsubscribe all.
  forEach(unsubscribe(app), state.get('subscriptions'))
  // Clear all our state.
  state.clear()
}

module.exports = {
  startUdp,
  stopUdp,
}
