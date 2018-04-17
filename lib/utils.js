const {
  conforms, flow, filter, get, includes, isFunction,
  isNumber, isObject, isString, overEvery, replace,
} = require('lodash/fp')
const { ip } = require('address')

const toBroadcast = replace(/[0-9]+$/, '255')
const getBroadcast = flow(ip, toBroadcast)

function createState() {
  return {
    tcp: new Map(),
    udp: new Map(),
  }
}
const propIsValidUdp = conforms({
  host: overEvery([isString, includes('.')]),
  port: isNumber,
})
const filterUdpProps = filter(propIsValidUdp)
const getUdpProps = flow(get('udp'), filterUdpProps)

const hasPluginProps = conforms({
  id: isString,
  name: isString,
  description: isString,
  start: isFunction,
  state: isObject,
  stop: isFunction,
  schema: isObject,
})
const hasAppProps = conforms({
  error: isFunction,
  on: isFunction,
  removeListener: isFunction,
})

module.exports = {
  createState,
  filterUdpProps,
  getUdpProps,
  hasPluginProps,
  hasAppProps,
  propIsValidUdp,
  getBroadcast,
}
