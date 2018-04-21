/* globals describe test expect jest */
const { bindPluginActions, pluginActions } = require('./plugin-state')

describe('bindPluginActions', () => {
  const dispatch = jest.fn()
  const actions = bindPluginActions(dispatch)
  test('returns expected', () => {
    expect(typeof actions.error).toBe('function')
    expect(typeof actions.setMsg).toBe('function')
    expect(typeof actions.set).toBe('function')
  })
  test('dispatch not called yet', () => {
    // console.log(dispatch.mock)
    expect(dispatch.mock.calls.length).toBe(0)
  })
  test('dispatch called w action obj', () => {
    // console.log(dispatch.mock)
    actions.setMsg('hello')
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: 'plugin/MSG',
      payload: 'hello',
    })
  })
  test('action shape', () => {
    expect(pluginActions.started()).toEqual({
      type: 'plugin/STARTED',
    })
  })
})
