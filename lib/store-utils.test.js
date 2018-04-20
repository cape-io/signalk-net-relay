/* globals describe test expect */
const { createActionType } = require('./store-utils')

describe('createActionType', () => {
  test('makes string from args', () => {
    expect(createActionType('foo', 'bar')).toBe('foo/bar')
  })
})
