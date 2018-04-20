const dgram = require('dgram')
// const { isPlainObject } = require('lodash/fp')

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
  // LISTENING. Socket is ready. Only happens after a bind() call.
  socket.on('listening', () => {
    if (broadcast === true) socket.setBroadcast(true)
    const { address, port } = socket.address()
    app.set('address', address)
    app.set('port', port)
    app.debug(`Ready on ${address}:${port}`)
    app.listening(true)
  })
  // CLOSE. Socket closed.
  socket.on('close', () => {
    // Exclude the socket from the reference counting that keeps the Node.js process active.
    socket.unref() // Not sure if we really need to do this.
    socket.removeAllListeners()
    app.debug('Socket closed.')
    app.ref.set('socket', null)
    // Skip app.started(false) app.listening(false) because stop() will take care of both.
    app.stop()
  })
  // Once you send() something it does a bind() anyway. So always do it now.
  // NOTE: A random port will be assiged if not passed along in bindOptions.
  socket.bind(bindOptions)
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
function createSocket(app, options = {}) {
  const { bindOptions, broadcast, socketOptions = { type: 'udp4' } } = options
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
