const { get } = require('lodash/fp')
/* globals afterAll describe test expect */
const netRelay = require('./')
const { hasPluginProps } = require('./utils')
const { getApp, props, PORT } = require('./test-mock')
const { closeSocket, openSocket } = require('./udp-socket')

describe('net-relay', () => {
  const app = getApp()
  const plugin = netRelay(app)
  test('hasPluginProps', () => {
    expect(hasPluginProps(plugin)).toBe(true)
  })

  plugin.start(props)
  // Listener to server events that will then dispatch.
  const dispatcher = get('on.mock.calls[0][1]', app)
  test('attaches listener', () => {
    expect(app.on.mock.calls.length).toBe(1)
    expect(app.on.mock.calls[0][0]).toBe('foo')
    expect(typeof dispatcher).toBe('function')
  })
  // Setup a UDP listener.
  const listenApp = getApp() // Listener
  const eventData = '!AIVDO,1,1,,A,B5Ndh@P00NmDnqRWn;33;wb5oP06,0'
  test('udp dispatched data', () => {
    expect.assertions(2)
    return openSocket(listenApp, { bindOptions: { port: PORT } })
      // Pretend to be SK sending the plugin some data.
      .then(() => dispatcher(eventData))
      .then(() => {
        expect(listenApp.data.mock.calls.length).toBe(1)
        expect(listenApp.data.mock.calls[0][0].toString()).toBe(eventData)
      })
  })

  afterAll(() => Promise.all([
    closeSocket(listenApp),
    plugin.stop(),
  ]))
})
