const { get } = require('lodash/fp')
/* globals describe jest test expect */
const dgram = require('dgram')
const netRelay = require('./')
const { hasPluginProps } = require('./utils')

function createUdpListen(handler, port) {
  const socket = dgram.createSocket('udp4')
  socket.on('message', handler)
  socket.bind(port)
  return socket
}

function getApp() {
  return {
    error: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  }
}

const PORT = 3033

describe('net-relay', () => {
  const app = getApp()
  const plugin = netRelay(app)
  test('hasPluginProps', () => {
    expect(hasPluginProps(plugin)).toBe(true)
  })
  const props = {
    udp: [{ eventId: 'foo', port: PORT, host: 'localhost' }],
  }
  plugin.start(props)
  const dispatcher = get('on.mock.calls[0][1]', app)
  test('attaches listener', () => {
    expect(app.on.mock.calls.length).toBe(1)
    expect(app.on.mock.calls[0][0]).toBe('foo')
    expect(typeof dispatcher).toBe('function')
  })
  const listen = jest.fn()
  const socket = createUdpListen(listen, PORT)
  const eventData = '!AIVDO,1,1,,A,B5Ndh@P00NmDnqRWn;33;wb5oP06,0'
  dispatcher(eventData)
  test('udp dispatched data', () => {
    expect(app.on.mock.calls[0][0]).toBe(eventData)
  })
})
