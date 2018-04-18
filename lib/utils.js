const {
  conforms, flow, filter, isFunction,
  isNumber, isObject, isString, replace,
} = require('lodash/fp')
const { ip } = require('address')
const createStore = require('./')

const toBroadcast = replace(/[0-9]+$/, '255')
const getBroadcastIp = flow(ip, toBroadcast)

function createState(initState = {}) {
  return {
    ...initState,
    error: false,
    running: false,
  }
}
const createPluginStore = flow(
  createState,
  createStore,

)

const propIsValidUdp = conforms({
  protocol: 'udp',
  hostname: isString,
  port: isNumber,
})

const getUdpProps = filter(propIsValidUdp)

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
  createStore,
  getUdpProps,
  hasPluginProps,
  hasAppProps,
  propIsValidUdp,
  getBroadcastIp,
}
