const dgram = require('dgram')
const { isPlainObject } = require('lodash/fp')

// Attach handlers to socket events and perform any binding.
function bindSocket(app, socket, bindOptions, broadcast = false) {
  // ERROR. Dang.
  socket.on('error', (err) => {
    app.debug(err.stack)
    app.error(err)
    // Run all the actions within close handler.
    socket.close()
  })
  // MESSAGE. Got a message!
  socket.on('message', (msg, rinfo) => {
    app.debug(`Message: ${msg} from ${rinfo.address}:${rinfo.port}`)
    app.data(msg)
  })
  // LISTENING. Socket is ready.
  socket.on('listening', () => {
    const address = socket.address()
    app.debug(`Ready on ${address.address}:${address.port}`)
    app.listening(true)
  })
  // CLOSE. Socket closed.
  socket.on('close', () => {
    // Exclude the socket from the reference counting that keeps the Node.js process active.
    socket.unref() // Not sure if we really need to do this.
    socket.removeAllListeners()
    app.debug('Socket closed.')
    app.started(false) // Skip app.listening(false) because if not started can't listen.
    app.ref.set('socket', null)
    app.stop()
  })
  // Is it required for this to be inside a bind? Do we need to listen before we can send.
  if (broadcast === true) socket.setBroadcast(true)
  if (isPlainObject(bindOptions)) socket.bind(bindOptions)
  app.debug('Socket created.')
  app.started(true)
}

/* Create a UDP Socket.
 * Example of app object:
  {
    data: <func>
    debug: <func>
    error: <func>
    listening: <func>
    started: <func>
    stop: <func>
    ref: { set: <func> },
  }

 * It takes the bindOptions as an object.
 * https://nodejs.org/api/dgram.html#dgram_socket_bind_options_callback
 * Example:
 {
    port: <integer>
    address: <string>
    exclusive: <boolean>
 },
 */
function createSocket(app, { bindOptions, broadcast, socketOptions = { type: 'udp4' } }) {
  app.debug('Creating socket.')
  try {
    // Create and save socket.
    const socket = dgram.createSocket(socketOptions)
    app.ref.set('socket', socket)
    bindSocket(app, socket, bindOptions, broadcast)
  } catch (error) {
    app.error(error)
    app.listening(false)
    app.started(false)
  }
}
module.exports = {
  bindSocket,
  createSocket,
}