const {
  curry, flow, get, isString, mapValues, partial, set, startsWith,
} = require('lodash/fp')
const { bindActionCreators } = require('redux')
const {
  createAction, createReducer, createSimpleAction,
} = require('cape-redux')
const { setKey } = require('cape-lodash')
const { createActionType } = require('./store-utils')

// PLUGIN ACTIONS
// @TODO Need to accept instance specific state.

const PLUGIN_PREFIX = 'plugin'
const pluginType = createActionType(PLUGIN_PREFIX)
const isPluginType = startsWith(PLUGIN_PREFIX)

const PLUGIN_DATA = pluginType('DATA')
const pluginStop = createSimpleAction(PLUGIN_DATA)

const PLUGIN_DEBUG = pluginType('DEBUG')
const serialDebug = createSimpleAction(PLUGIN_DEBUG)

const PLUGIN_ERROR = pluginType('ERROR')
const pluginError = createAction(PLUGIN_ERROR)

const PLUGIN_LISTENING = pluginType('LISTENING')
const pluginListening = createAction(PLUGIN_LISTENING)

const PLUGIN_MSG = pluginType('MSG')
const pluginSetMsg = createSimpleAction(PLUGIN_MSG)

const PLUGIN_SET = pluginType('SET')
const pluginSetPayload = curry((path, value) => ({ path, value }))
const pluginSet = createSimpleAction(PLUGIN_SET, pluginSetPayload)

const PLUGIN_STARTED = pluginType('STARTED')
const pluginStarted = createAction(PLUGIN_STARTED)

const PLUGIN_STOP = pluginType('STOP')
const serialData = createSimpleAction(PLUGIN_STOP)

const pluginActions = {
  data: serialData,
  debug: serialDebug,
  error: pluginError,
  listening: pluginListening,
  setMsg: pluginSetMsg,
  set: pluginSet,
  started: pluginStarted,
  stop: pluginStop,
}
const addPluginMeta = set('meta.pluginId')
const pluginDispatch = curry((dispatch, pluginId) => flow(addPluginMeta(pluginId), dispatch))

// Attach dispatch to the actions.
const bindPluginActions = partial(bindActionCreators, [pluginActions])

// PLUGIN REDUCER
const setValue = (state, { path, value }) => set(path, value, state)
const setMsg = setKey('statusMessage')
const reducers = {
  [PLUGIN_LISTENING]: setKey('listening'),
  [PLUGIN_SET]: setValue,
  [PLUGIN_MSG]: setMsg,
}
const initState = {
  data: null,
  debug: null,
  errorMsg: null,
  hasError: null,
  listening: null,
  started: null,
  stopped: null,
}
const pluginReducer = createReducer(reducers, initState)

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

const selectors = {
  getStatusMessage: get('statusMessage'),
}
const getSelectors = getState =>
  mapValues(item => flow(getState, item), selectors)

module.exports = {
  bindPluginActions,
  getSelectors,
  pluginActions,
  pluginDispatch,
  pluginsReducer,
}
