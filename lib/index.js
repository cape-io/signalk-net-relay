const schema = require('./schema')
const { startUdp, stopUdp } = require('./udp')
const { startTcp, stopTcp } = require('./tcp')
const { createState, getUdpProps } = require('./utils')

const buildStart = (app, state) => (props) => {
  if (!props) return
  if (props.tcp && props.tcp.length) startTcp(app, state.tcp, props.tcp)
  const udpProps = getUdpProps(props)
  if (udpProps && udpProps.length) startUdp(app, state.udp, udpProps)
}
const buildStop = (app, state) => () => {
  stopTcp(app, state.tcp)
  stopUdp(app, state.udp)
}

module.exports = function netRelay(app) {
  const state = createState()
  return {
    id: 'net-relay',
    name: 'IP Network Event Broadcast',
    description: 'Sends messages of specific event type to TCP/UDP IP Network destinations.',
    schema,
    start: buildStart(app, state),
    state,
    stop: buildStop(app, state),
  }
}
