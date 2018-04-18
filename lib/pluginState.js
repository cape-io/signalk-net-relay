const {
  curry, curryN, flow, get, isString, join, partial, set, startsWith,
} = require('lodash/fp')
const { bindActionCreators } = require('redux')
const {
  createAction, createReducer, createSimpleAction,
} = require('cape-redux')
const { setKey } = require('cape-lodash')

const createActionType = curryN(2, () => join('/', arguments))

// PLUGIN ACTIONS
// @TODO Need to accept instance specific state.
const PLUGIN_PREFIX = 'plugin'
const pluginType = createActionType(PLUGIN_PREFIX)
const isPluginType = startsWith(PLUGIN_PREFIX)

const PLUGIN_SET = pluginType('SET')
const pluginSetPayload = curry((path, value) => ({ path, value }))
const pluginSet = createSimpleAction(PLUGIN_SET, pluginSetPayload)

const PLUGIN_MSG = pluginType('MSG')
const pluginSetMsg = createSimpleAction(PLUGIN_MSG)

const PLUGIN_ERROR = pluginType('ERROR')
const pluginError = createAction(PLUGIN_ERROR)

const pluginActions = {
  error: pluginError,
  setMsg: pluginSetMsg,
  set: pluginSet,
}
const addPluginMeta = set('meta.pluginId')
const pluginDispatch = curry((dispatch, pluginId) => flow(addPluginMeta(pluginId), dispatch))

// We want to send the created action to addPluginMeta(pluginId).
// const getPluginActions = pluginId =>
//   mapValues(partialRight(flow, addPluginMeta(pluginId)), pluginActions)

// Attach dispatch to the actions.
const bindPluginActions = partial(bindActionCreators, pluginActions)

// PLUGIN REDUCER
const setValue = (state, { path, value }) => set(path, value, state)
const setMsg = setKey('statusMessage')
const reducers = {
  [PLUGIN_SET]: setValue,
  [PLUGIN_MSG]: setMsg,
}
const pluginReducer = createReducer(reducers, { statusMessage: null })

function pluginsReducer(state = {}, action) {
  if (!isPluginType(action.type)) return state
  if (!isString(action.meta.pluginId)) {
    throw new Error('Action must contain meta.pluginId. Please use plugin dispatcher.')
  }
  // Get the state slice we need for this action.
  const oldState = get(action.meta.pluginId, state)
  const newState = pluginReducer(oldState, action)
  // Do not create a new object if there is not change.
  if (oldState === newState) return state
  return set(action.meta.pluginId, newState, state)
}

module.exports = {
  bindPluginActions,
  pluginActions,
  pluginDispatch,
  pluginsReducer,
}
