const { get } = require('lodash/fp')
/* globals describe test expect */
const netRelay = require('./')
const { delayPromise } = require('./utils')
const {
  getApp, getOldApp, props, PORT,
} = require('./test-mock')
const { closeSocket, openSocket } = require('./udp-socket')

describe('net-relay', () => {
  const app = getOldApp()
  const plugin = netRelay(app)
  test('hasPluginProps', () => {
    expect(plugin.id).toBe('net-relay')
    expect(typeof plugin.stop).toBe('function')
  })

  const pluginStarting = plugin.start(props)
  // Listener to server events that will then dispatch.
  test('attaches listener', () => {
    expect.assertions(3)
    return pluginStarting.then(() => {
      const dispatcher = get('on.mock.calls[0][1]', app)
      expect(app.on.mock.calls.length).toBe(1)
      expect(app.on.mock.calls[0][0]).toBe('foo')
      expect(typeof dispatcher).toBe('function')
    })
  })
  // Setup a UDP listener.
  const listenApp = getApp() // Listener
  const eventData = '!AIVDO,1,1,,A,B5Ndh@P00NmDnqRWn;33;wb5oP06,0'
  test('udp dispatched data', () => {
    const dispatcher = get('on.mock.calls[0][1]', app)
    expect.assertions(4)
    return openSocket(listenApp, { bindOptions: { port: PORT } })
      // Pretend to be SK sending the plugin some data.
      .then(() => dispatcher(eventData))
      .then(delayPromise(100))
      .then(() => {
        expect(app.debug.mock.calls[4][0]).toBe('Sent data to localhost:3033')
        expect(listenApp.debug.mock.calls.length).toBe(4)
        expect(listenApp.data.mock.calls.length).toBe(1)
        expect(listenApp.data.mock.calls[0][0].toString()).toBe(`${eventData}\r\n`)
      })
  })
  test('plugin.stop', () => {
    expect.assertions(2)
    expect(typeof plugin.stop).toBe('function')
    return closeSocket(listenApp)
      .then(() => plugin.stop())
      .then(() => {
        expect(plugin.store.getState().plugin['signalk-net-relay'].base.address).toBe('0.0.0.0')
        // console.log(plugin.store.getState())
      })
  })
})
