/* globals describe jest test expect */
const { get, isError } = require('lodash/fp')
const { subscribe, sendData } = require('./udp')
const { getApp, props } = require('./test-mock')

const listenerInfo = {
  listener: jest.fn(),
  eventId: 'bug',
}
// const sendData = jest.fn()
describe('subscribe', () => {
  const app = getApp()
  test('attaches listener to app.on', () => {
    subscribe(app)(listenerInfo)
    const listener = get('on.mock.calls[0][1]', app)
    expect(app.on.mock.calls.length).toBe(1)
    expect(app.on.mock.calls[0][0]).toBe('bug')
    expect(typeof listener).toBe('function')
    expect(listener).toBe(listenerInfo.listener)
  })
})
describe('sendData', () => {
  const app = getApp()
  // sendData
  const data = 'something-great'
  const socketSend = jest.fn()
  app.ref.set('socket.send', socketSend)
  sendData(app, props[0], data)
  test('socket.send called with correct args', () => {
    expect(socketSend.mock.calls.length).toBe(1)
    const call1 = socketSend.mock.calls[0]
    expect(call1[0]).toBe(data)
    expect(call1[1]).toBe(0)
    expect(call1[2]).toBe(15)
    expect(call1[3]).toBe(3033)
    expect(call1[4]).toBe('localhost')
    expect(typeof call1[5]).toBe('function')
  })
  test('socket callback error sends app.error', () => {
    socketSend.mock.calls[0][5](new Error('example error'))
    socketSend.mock.calls[0][5]() // Socket sent without error.
    expect(app.error.mock.calls.length).toBe(1)
    const call1 = app.error.mock.calls[0]
    expect(typeof call1[0]).toBe('object')
    expect(isError(call1[0])).toBe(true)
    expect(call1[0].message).toBe('example error')
  })
  test('expect')
})
