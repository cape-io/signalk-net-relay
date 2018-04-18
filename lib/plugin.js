const { schema, validate } = require('./schema')
const { getUiSchema } = require('./ui-schema')
const { startUdp, stopUdp } = require('./udp')
const { startTcp, stopTcp } = require('./tcp')
const { createStore, getUdpProps } = require('./utils')

const buildStart = (app, store) => (props) => {
  if (!validate(props)) {
    store.setState('statusMessage', validate.error)
    return
  }
  if (props.tcp && props.tcp.length) startTcp(app, store, props.tcp)
  const udpProps = getUdpProps(props)
  if (udpProps && udpProps.length) startUdp(app, store, udpProps)
}
const buildStop = (app, state) => () => {
  stopTcp(app, state.tcp)
  stopUdp(app, state.udp)
}

function netRelay(app) {
  return {
    id: 'net-relay',
    name: 'IP Network Event Broadcast',
    description: 'Sends messages of specific event type to TCP/UDP IP Network destinations.',
    statusMessage: store.getStatusMessage,
    schema,
    start: buildStart(app, store),
    state: store.getState(),
    stop: buildStop(app, store),
    uiSchema: getUiSchema,
  }
}

module.exports = netRelay
