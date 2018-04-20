/* globals describe test expect */
// const { delay } = require('lodash/fp')
const { createSocket } = require('./udp-socket')
const { getApp, PORT } = require('./test-mock')

const data = 'something data'
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
    expect(app.listening.mock.calls.length).toBe(0)
  })
  test('Listening and sending a message.', () => {
    expect.assertions(4)
    const app2 = getApp() // Listener
    createSocket(app2, { bindOptions: { port: PORT } })
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(app2.debug.mock.calls[2][0]).toBe('Ready on 0.0.0.0:3033')
        expect(app2.listening.mock.calls.length).toBe(1)
        // Send to self.
        app.ref.get('socket').send(data, 0, data.length, PORT, 'localhost', (err) => {
          expect(err).toBe(null)
          const randomPort = app.set.mock.calls[1][1]
          expect(app.debug.mock.calls[2][0]).toBe(`Ready on 0.0.0.0:${randomPort}`)
          setTimeout(() => {
            app2.ref.get('socket').close(() => {
              resolve()
            })
          }, 200)
        })
      }, 200)
    })
  })
  test('Closing down clears out refs.', () => {
    expect.assertions(4)
    expect(app.stop.mock.calls.length).toBe(0)
    return new Promise((resolve) => {
      app.ref.get('socket').close(() => {
        expect(app.ref.get('socket')).toBe(null)
        expect(app.debug.mock.calls[3][0]).toBe('Socket closed.')
        expect(app.stop.mock.calls.length).toBe(1)
        resolve()
      })
    })
  })
})
