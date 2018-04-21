const {
  conforms, endsWith, flow, isFunction,
  replace, some, unary,
} = require('lodash/fp')
const { ip } = require('address')
// const Joi = require('joi')

const toBroadcast = replace(/[0-9]+$/, '255')
const getBroadcastIp = flow(ip, toBroadcast)
const getDefaultBroadcastIp = unary(getBroadcastIp)
const isBroadcastIp = endsWith('.255')
const hasBroadcastProp = some(conforms({ hostname: isBroadcastIp }))


// const hasPluginProps = Joi.object().keys({
//   id: Joi.string().lowercase().regex(/^[a-z0-9-]+$/).min(3)
//     .max(30)
//     .required(),
//   description: Joi.string(),
//   name: Joi.string(),
//   start: Joi.func().arity(1),
//   state: isObject,
//   stop: Joi.func().arity(0),
//   // store: isObject,
//   schema: Joi.object(),
//   statusMessage: [Joi.func()],
// })

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
  // hasPluginProps,
  hasAppProps,
  getBroadcastIp,
  getDefaultBroadcastIp,
}
