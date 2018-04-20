/* globals describe test expect */
const { getBroadcastIp } = require('./utils')

describe('getBroadcastIp', () => {
  test('isFunction', () => {
    expect(typeof getBroadcastIp).toBe('function')
  })
  test('Returns network broadcast.', () => {
    expect(getBroadcastIp()).toEqual('123.234')
  })
})
