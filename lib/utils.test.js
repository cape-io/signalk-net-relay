/* globals describe test expect */
const { getBroadcastIp, getDefaultBroadcastIp, getUdpProps } = require('./utils')
const { props } = require('./test-mock')

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

describe('getUdpProps', () => {
  test('true when it finds one', () => {
    expect(getUdpProps(props)).toEqual([props[0]])
  })
})
