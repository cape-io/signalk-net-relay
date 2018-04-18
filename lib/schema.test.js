/* globals describe test expect */
const { isUdpProp } = require('./schema')
const { props } = require('./test-mock')

describe('isUdpProp', () => {
  test('valid', () => {
    expect(isUdpProp(props[0])).toBe(true)
  })
  test('invalid', () => {
    expect(isUdpProp(props[1])).toBe(false)
  })
})
