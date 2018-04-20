const { get } = require('lodash/fp')
/* globals afterAll describe test expect */
const netRelay = require('./')
const { delayPromise, hasPluginProps } = require('./utils')
const { getApp, props, PORT } = require('./test-mock')
const { closeSocket, openSocket } = require('./udp-socket')

describe('net-relay', () => {
  const app = getApp()
  const plugin = netRelay(app)
  test('hasPluginProps', () => {
    expect(hasPluginProps(plugin)).toBe(true)
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
      .then(() => expect(app.debug.mock.calls[3][0]).toBe('Sent data to localhost:3033'))
      .then(delayPromise(200))
      .then(() => {
        expect(listenApp.debug.mock.calls.length).toBe(4)
        expect(listenApp.data.mock.calls.length).toBe(1)
        expect(listenApp.data.mock.calls[0][0].toString()).toBe(eventData)
      })
  })

  afterAll(() => Promise.all([
    closeSocket(listenApp),
    plugin.stop(),
  ]))
})
