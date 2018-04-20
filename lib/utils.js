const {
  conforms, endsWith, flow, isFunction,
  isObject, isString, overSome, replace, some, unary,
} = require('lodash/fp')
const { ip } = require('address')

const toBroadcast = replace(/[0-9]+$/, '255')
const getBroadcastIp = flow(ip, toBroadcast)
const getDefaultBroadcastIp = unary(getBroadcastIp)
const isBroadcastIp = endsWith('.255')
const hasBroadcastProp = some(conforms({ hostname: isBroadcastIp }))


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
  hasBroadcastProp,
  hasPluginProps,
  hasAppProps,
  getBroadcastIp,
  getDefaultBroadcastIp,
}
