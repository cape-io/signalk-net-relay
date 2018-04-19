const {
  conforms, flow, filter, isFunction,
  isObject, isString, overSome, replace,
} = require('lodash/fp')
const { ip } = require('address')
const createStore = require('./')
const { isUdpProp } = require('./schema')

const toBroadcast = replace(/[0-9]+$/, '255')
const getBroadcastIp = flow(ip, toBroadcast)

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

module.exports = {
  createStore,
  getUdpProps,
  hasPluginProps,
  hasAppProps,
  getBroadcastIp,
}
