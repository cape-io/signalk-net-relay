const {
  conforms, endsWith, flow, filter, isFunction,
  isObject, isString, overSome, replace, some, unary,
} = require('lodash/fp')
const { ip } = require('address')
const { isUdpProp } = require('./schema')

const toBroadcast = replace(/[0-9]+$/, '255')
const getBroadcastIp = flow(ip, toBroadcast)
const getDefaultBroadcastIp = unary(getBroadcastIp)
const isBroadcastIp = endsWith('.255')
const hasBroadcastProp = some(conforms({ hostname: isBroadcastIp }))

const getUdpProps = filter(isUdpProp)

const hasPluginProps = conforms({
  id: isString,
  name: isString,
  description: isString,
  start: isFunction,
  state: isObject,
  stop: isFunction,
  schema: isObject,
  statusMessage: isFunction,
  uiSchema: overSome([isFunction, isObject]),
})
const hasAppProps = conforms({
  error: isFunction,
  on: isFunction,
  removeListener: isFunction,
})

const delayPromise = milisecs => val =>
  new Promise(resolve => setTimeout(() => resolve(val), milisecs))

module.exports = {
  delayPromise,
  getUdpProps,
  hasBroadcastProp,
  hasPluginProps,
  hasAppProps,
  getBroadcastIp,
  getDefaultBroadcastIp,
}
