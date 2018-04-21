/* globals describe test expect */
const fillApp = require('./fill-app')
const { getOldApp } = require('./test-mock')
const createStore = require('./create-store')

describe('fillApp', () => {
  const oldApp = getOldApp()
  const store = createStore()
  test('store state', () => {
    expect(store.getState()).toEqual({ config: {}, plugin: {} })
  })
  // Make it a plugin friendly thing.
  const app = fillApp(oldApp, store, 'kai')
  test('state', () => {
    expect(app.getState()).toEqual({})
  })
  test('debug', () => {
    app.debug('foo')
    const state = {
      base: {
        data: null,
        debug: 'foo',
        errorMsg: null,
        hasError: null,
        listening: null,
        started: null,
        stopped: null,
      },
    }
    expect(app.getState()).toEqual(state)
    expect(oldApp.debug.mock.calls.length).toBe(1)
    expect(oldApp.debug.mock.calls[0][0]).toBe('foo')
  })
})
