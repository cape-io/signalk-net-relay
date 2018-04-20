/* globals describe test expect */
// const { delay } = require('lodash/fp')
const { closeSocket, createSocket } = require('./udp-socket')
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
    expect.assertions(5)
    const app2 = getApp() // Listener
    return createSocket(app2, { bindOptions: { port: PORT } })
      .then(() => {
        expect(app2.debug.mock.calls[2][0]).toBe('Ready on 0.0.0.0:3033')
        expect(app2.listening.mock.calls.length).toBe(1)
        return new Promise((resolve) => {
          // Send to self.
          app.ref.get('socket').send(data, 0, data.length, PORT, 'localhost', (err) => {
            expect(err).toBe(null)
            const randomPort = app.set.mock.calls[1][1]
            expect(app.debug.mock.calls[2][0]).toBe(`Ready on 0.0.0.0:${randomPort}`)
            setTimeout(() => {
              expect(app2.data.mock.calls[0][0].toString()).toBe(data)
              closeSocket(app2).then(resolve)
            }, 100)
          })
        })
      })
  })
  test('Not closed yet', () => {
    expect(app.stop.mock.calls.length).toBe(0)
  })
  test('Closing down clears out refs.', () => {
    expect.assertions(3)
    return closeSocket(app).then(() => {
      expect(app.ref.get('socket')).toBe(null)
      expect(app.debug.mock.calls[3][0]).toBe('Socket closed.')
      expect(app.stop.mock.calls.length).toBe(1)
    })
  })
})
