const { combineReducers, createStore } = require('redux')
const { dispatcher } = require('cape-redux')
const { pluginDispatch, pluginsReducer } = require('./plugin-state')
const { storeHelpers } = require('./store-utils')

function configureStore() {
  const reducer = combineReducers({
    plugin: pluginsReducer,
  })
  const reduxStore = createStore(reducer)
  const reduxDispatcher = dispatcher(reduxStore.dispatch)
  return {
    ...storeHelpers(reduxStore.getState),
    ...createStore(reducer),
    dispatcher: reduxDispatcher,
    pluginDispatch: pluginDispatch(reduxStore.dispatch),
  }
}

module.exports = configureStore
