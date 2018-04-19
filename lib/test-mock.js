/* globals jest */
const { createRefStore } = require('./store-utils')

const PORT = 3033

const props = [{
  eventId: 'foo', port: PORT, hostname: 'localhost', protocol: 'udp',
}, {
  eventId: 'bar', port: PORT, protocol: 'tcp',
}]

function getApp() {
  return {
    error: jest.fn(),
    on: jest.fn(),
    ref: createRefStore(),
    removeListener: jest.fn(),
  }
}

module.exports = {
  getApp, props, PORT,
}
