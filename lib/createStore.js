const { get, set } = require('lodash/fp')
const { combineReducers, createStore } = require('redux')
const { dispatcher } = require('cape-redux')
const { pluginDispatch, pluginsReducer } = require('./pluginState')

// Getter Helpers
function storeHelpers(getState) {
  return {
    get: path => get(path, getState()),
    selector: select => () => select(getState()),
  }
}

function createRefStore(initState = {}) {
  let state = initState
  const getState = () => state
  return {
    ...storeHelpers(getState),
    getState,
    resetState: () => { state = initState },
    set: (path, value) => { state = set(path, value, getState()) },
  }
}
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
    createRefStore,
  }
}

module.exports = configureStore
