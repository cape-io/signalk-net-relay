const {
  flow, isEmpty, over, partial,
} = require('lodash/fp')
const { schema, validate } = require('./schema')
const { uiSchema } = require('./ui-schema')
const { startUdp, stopUdp } = require('./udp')
const { stopTcp } = require('./tcp')
const { getUdpProps } = require('./utils')

// STOP.
const buildStop = flow(over([stopTcp, stopUdp]), partial(Promise.all))

// START.
const buildStart = app => (props) => {
  if (!validate(props)) {
    app.set('statusMessage', validate.error)
    return
  }
  // @TODO: Create TCP Plugin.
  // if (props.tcp && props.tcp.length) startTcp(app, props)
  // @TODO: Manage plugin instances here?
  const udpProps = getUdpProps(props)
  if (!isEmpty(udpProps)) startUdp(app, udpProps)
}

function netRelay(app) {
  // console.log(app)
  return {
    id: 'net-relay',
    name: 'IP Network Event Broadcast',
    // @TODO: RX in addition to TX.
    description: 'Sends messages of specific event type to TCP/UDP IP Network destinations.',
    schema,
    start: buildStart(app),
    stop: buildStop(app),
    uiSchema,
  }
}

module.exports = netRelay
