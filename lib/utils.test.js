/* globals describe test expect */
const { getBroadcastIp, getDefaultBroadcastIp } = require('./utils')

describe('getBroadcastIp', () => {
  test('isFunction', () => {
    expect(typeof getBroadcastIp).toBe('function')
  })
  test('Returns network broadcast.', () => {
    expect(getBroadcastIp('lo')).toEqual('127.0.0.255')
  })
})
describe('getDefaultBroadcastIp', () => {
  test('isFunction', () => {
    expect(typeof getDefaultBroadcastIp).toBe('function')
    expect(getBroadcastIp('lo')).toEqual('127.0.0.255')
  })
})
