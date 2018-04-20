const {
  curryN, get, invoke, join, set,
} = require('lodash/fp')

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
    clear: () => { state = initState },
    invoke: path => invoke(path, getState()),
    set: (path, value) => { state = set(path, value, getState()) },
  }
}

const createActionType = curryN(2, (...args) => join('/', args))

module.exports = {
  createActionType,
  storeHelpers,
  createRefStore,
}
