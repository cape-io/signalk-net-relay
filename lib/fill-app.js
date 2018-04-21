const {
  over,
} = require('lodash/fp')
const { createPluginStore } = require('./plugin-state')
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

module.exports = fillApp
