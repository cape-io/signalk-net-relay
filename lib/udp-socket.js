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
  app.started(true) // Started. But not listening yet.
  app.debug('Socket created.')
  // Once you send() something it does a bind() anyway. So always do it now.
  // NOTE: A random port will be assiged if not passed along in bindOptions.
  return new Promise((resolve) => {
    socket.bind(bindOptions, resolve)
  })
}

/* Create a UDP Socket.
 * Example of app object:
  {
    data: <func>
    debug: <func>
    error: <func>
    listening: <func>
    set: <func>
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
function openSocket(app, options = {}) {
  const { bindOptions, broadcast, socketOptions = { type: 'udp4' } } = options
  app.debug('Creating socket.')
  try {
    // Create and save socket.
    const socket = dgram.openSocket(socketOptions)
    app.ref.set('socket', socket)
    return bindSocket(app, socket, bindOptions, broadcast)
  } catch (error) {
    app.error(error)
    app.listening(false)
    app.started(false)
    return Promise.reject(error)
  }
}
const closeSocket = app => new Promise((resolve) => {
  app.ref.get('socket').close(() => { resolve() })
})
module.exports = {
  bindSocket,
  closeSocket,
  openSocket,
}
