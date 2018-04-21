const { defaultTo } = require('lodash/fp')
const { combineReducers, createStore } = require('redux')
const { dispatcher } = require('cape-redux')
const { pluginsReducer } = require('./plugin-state')
const { storeHelpers } = require('./store-utils')

function configureStore(initState = {}) {
  const reducer = combineReducers({
    config: defaultTo({}),
    plugin: pluginsReducer,
  })
  const reduxStore = createStore(reducer, initState)
  return {
    ...storeHelpers(reduxStore.getState),
    ...reduxStore,
    dispatcher: dispatcher(reduxStore.dispatch),
  }
}

module.exports = configureStore
