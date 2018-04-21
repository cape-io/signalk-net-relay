const createStore = require('./create-store')
const netPlugin = require('./plugin')
const { getSelectors } = require('./plugin-state')
const fillApp = require('./fill-app')

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
  app.debug('net-relay INIT')
  const store = createStore()
  const pluginName = 'signalk-net-relay'
  const plugin = doRegisterPlugin(app, pluginName, store)
  return plugin
}
module.exports = wrappedPlugin
