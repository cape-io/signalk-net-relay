const { get } = require('lodash/fp')
/* globals describe jest test expect */
const netRelay = require('./')
const { hasPluginProps } = require('./utils')
const { getApp, props, PORT } = require('./test-mock')


const listen = jest.fn()
// const socket = createUdpListen(listen, PORT)

describe('net-relay', () => {
  const app = getApp()
  const plugin = netRelay(app)
  test('hasPluginProps', () => {
    expect(hasPluginProps(plugin)).toBe(true)
  })

  plugin.start(props)
  const dispatcher = get('on.mock.calls[0][1]', app)
  test('attaches listener', () => {
    expect(app.on.mock.calls.length).toBe(1)
    expect(app.on.mock.calls[0][0]).toBe('foo')
    expect(typeof dispatcher).toBe('function')
  })
  const eventData = '!AIVDO,1,1,,A,B5Ndh@P00NmDnqRWn;33;wb5oP06,0'
  test('udp dispatched data', () => {
    dispatcher(eventData)
    // expect(listen.mock.calls.length).toBe(1)
  })
})
