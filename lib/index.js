const { overEvery } = require('lodash/fp')
const createStore = require('./createStore')
const netPlugin = require('./plugin')
const { bindPluginActions } = require('./pluginState')

// Pretend to be a possible future version of sk server.
function doRegisterPlugin(app, pluginName, store) {
  const dispatch = store.pluginDispatch(pluginName)
  const { error, ...actions } = bindPluginActions(dispatch)
  return netPlugin({
    ...actions,
    ...app,
    error: overEvery([
      error, app.error,
    ]),
    dispatch,
  })
}

function wrappedPlugin(app) {
  const store = createStore()
  const pluginName = 'signalk-net-relay'
  return doRegisterPlugin(app, pluginName, store)
}
module.exports = wrappedPlugin
