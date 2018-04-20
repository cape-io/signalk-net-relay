const {
  flow, getOr, overEvery,
} = require('lodash/fp')
const createStore = require('./createStore')
const netPlugin = require('./plugin')
const { bindPluginActions, getSelectors } = require('./plugin-state')
const { createRefStore, storeHelpers } = require('./store-utils')

// Pretend to be a possible future version of sk server.
function doRegisterPlugin(app, pluginName, store) {
  // Plugin scope dispatch function.
  const dispatch = store.pluginDispatch(pluginName)
  // Plugin scope getState.
  const getState = flow(store.getState, getOr({}, ['plugin', pluginName]))
  // Plugin getters.
  const selectors = getSelectors(getState)
  // Extract error func so we can double up.
  const { error, ...actions } = bindPluginActions(dispatch)
  // console.log(actions)
  const plugin = netPlugin({
    ...actions,
    ...storeHelpers(getState),
    ...app,
    error: overEvery([
      error, app.error,
    ]),
    getState,
    dispatch,
    ref: createRefStore(),
  })
  // Add certain things to the plugin response automatically.
  return {
    ...plugin,
    state: getState(),
    statusMessage: selectors.getStatusMessage,
  }
}

function wrappedPlugin(app) {
  const store = createStore()
  const pluginName = 'signalk-net-relay'
  const plugin = doRegisterPlugin(app, pluginName, store)
  // console.log(plugin)
  return plugin
}
module.exports = wrappedPlugin
