/* globals describe test expect */
const configureStore = require('./create-store')
const { createPluginStore } = require('./plugin-state')

describe('configureStore', () => {
  const initState = { config: { foo: 1, bar: 2, baz: 'cat' }, plugin: {} }
  const store = configureStore(initState)
  test('initState', () => {
    expect(store.getState()).toBe(initState)
  })
  test('creates store', () => {
    expect(typeof store.dispatch).toBe('function')
    // expect(store.dispatch(pluginActions.started())).toThrow()
  })
  const pluginStore = createPluginStore(store, 'hello')
  test('dispatch pluginStore', () => {
    pluginStore.started()
    // plugin/pluginId/instanceId/{state}
    expect(store.get('plugin.hello.base.started')).toBe(true)
  })
  test('state', () => {
    expect(store.get('config')).toBe(initState.config)
  })
})
