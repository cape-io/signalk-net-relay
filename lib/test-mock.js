/* globals jest */
// const { debug } = require('debug') // eslint-disable-line import/no-extraneous-dependencies
const { createRefStore } = require('./store-utils')

const pluginName = 'signalk-net-relay'

const PORT = 3033

const props = {
  events: [{
    eventId: 'foo', port: PORT, hostname: 'localhost', protocol: 'udp',
  }, {
    eventId: 'bar', port: PORT, protocol: 'tcp',
  }],
}

function getApp() {
  return {
    data: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    listening: jest.fn(),
    on: jest.fn(),
    ref: createRefStore(),
    removeListener: jest.fn(),
    set: jest.fn(),
    started: jest.fn(),
    stop: jest.fn(),
  }
}

module.exports = {
  getApp, pluginName, props, PORT,
}
