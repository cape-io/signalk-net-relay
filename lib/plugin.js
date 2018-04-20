const { flow, over } = require('lodash/fp')
const { schema, validate } = require('./schema')
const { uiSchema } = require('./ui-schema')
const { startUdp, stopUdp } = require('./udp')
const { startTcp, stopTcp } = require('./tcp')
const { getUdpProps } = require('./utils')

const buildStart = app => (props) => {
  if (!validate(props)) {
    app.set('statusMessage', validate.error)
    return
  }
  if (props.tcp && props.tcp.length) startTcp(app, props)
  const udpProps = getUdpProps(props)
  if (udpProps && udpProps.length) startUdp(app, udpProps)
}
const buildStop = flow(over([stopTcp, stopUdp]), over)

function netRelay(app) {
  // console.log(app)
  return {
    id: 'net-relay',
    name: 'IP Network Event Broadcast',
    description: 'Sends messages of specific event type to TCP/UDP IP Network destinations.',
    schema,
    start: buildStart(app),
    stop: buildStop(app),
    uiSchema,
  }
}

module.exports = netRelay
