/* globals describe test jest expect */
const { constant } = require('lodash/fp')
const { createActionType, createRefStore, storeHelpers } = require('./store-utils')

describe('createActionType', () => {
  test('makes string from args', () => {
    expect(createActionType('foo', 'bar')).toBe('foo/bar')
  })
})
describe('createRefStore', () => {
  const func = jest.fn()
  const ref = createRefStore()
  ref.set('foo.bar', func)
  test('set and get work', () => {
    expect(ref.get('foo.bar')).toBe(func)
  })
  test('invoke will call func', () => {
    ref.invoke('foo.bar')
    expect(func.mock.calls.length).toBe(1)
    expect(func.mock.calls[0[0]]).toBe(undefined)
  })
})
describe('storeHelpers', () => {
  const getState = constant({ foo: { bar: 1, baz: 2 } })
  const store = storeHelpers(getState)
  test('shape', () => {
    expect(typeof store.get).toBe('function')
    expect(typeof store.selector).toBe('function')
  })
  test('get', () => {
    expect(store.get('foo.bar')).toBe(1)
    expect(store.get('foo.baz')).toBe(2)
  })
})
