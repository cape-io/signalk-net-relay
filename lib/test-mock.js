const PORT = 3033

const props = [{
  eventId: 'foo', port: PORT, hostname: 'localhost', protocol: 'udp',
}, {
  eventId: 'bar', port: PORT, protocol: 'tcp',
}]

module.exports = {
  props, PORT,
}
