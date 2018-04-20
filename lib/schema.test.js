/* globals describe test expect */
const { getUdpProps, isUdpProp } = require('./schema')
const { props, PORT } = require('./test-mock')

describe('isUdpProp', () => {
  test('valid', () => {
    expect(isUdpProp(props.events[0])).toBe(true)
  })
  test('invalid', () => {
    expect(isUdpProp(props.events[1])).toBe(false)
  })
})

describe('getUdpProps', () => {
  test('true when it finds one', () => {
    expect(getUdpProps(props)).toEqual([{
      eventId: 'foo', port: PORT, hostname: 'localhost', protocol: 'udp',
    }])
  })
})
