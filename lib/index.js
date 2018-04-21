const {
  over,
} = require('lodash/fp')
const createStore = require('./create-store')
const netPlugin = require('./plugin')
const { createPluginStore, getSelectors } = require('./plugin-state')
const { createRefStore, storeHelpers } = require('./store-utils')

function fillApp(oldApp, store, pluginName) {
  const pluginStore = createPluginStore(store, pluginName)
  return {
    ...oldApp,
    ...storeHelpers(pluginStore),
    ...pluginStore,
    debug: over([pluginStore.debug, oldApp.debug]),
    error: over([pluginStore.error, oldApp.error]),
    ref: createRefStore(),
  }
}

// Pretend to be a possible future version of sk server.
function doRegisterPlugin(oldApp, pluginName, store) {
  const app = fillApp(oldApp, store, pluginName)
  // Plugin getters.
  const selectors = getSelectors(app.getState)
  const plugin = netPlugin(app)
  // Add certain things to the plugin response automatically.
  return {
    ...plugin,
    store,
    statusMessage: selectors.getStatusMessage,
  }
}

function wrappedPlugin(app) {
  const store = createStore()
  const pluginName = 'signalk-net-relay'
  const plugin = doRegisterPlugin(app, pluginName, store)
  return plugin
}
module.exports = wrappedPlugin
