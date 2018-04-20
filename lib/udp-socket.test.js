/* globals describe test expect */
const { createSocket } = require('./udp-socket')
const { getApp, props } = require('./test-mock')

describe('createSocket', () => {
  test('isFunction', () => {
    expect(typeof createSocket).toBe('function')
  })
  const app = getApp()
  createSocket(app)
  test('Created and assigned socket to ref.', () => {
    expect(typeof app.ref.get('socket.send')).toBe('function')
    expect(app.started.mock.calls.length).toBe(1)
    expect(app.started.mock.calls[0][0]).toBe(true)
    expect(app.debug.mock.calls[1][0]).toBe('Socket created.')
  })
  test('Closing down clears out refs.', () => {
    expect.assertions(5)
    expect(app.stop.mock.calls.length).toBe(0)
    return new Promise((resolve) => {
      app.ref.get('socket').close(() => {
        expect(app.ref.get('socket')).toBe(null)
        expect(app.started.mock.calls.length).toBe(2)
        expect(app.debug.mock.calls[2][0]).toBe('Socket closed.')
        expect(app.stop.mock.calls.length).toBe(1)
        resolve()
      })
    })
  })
})
