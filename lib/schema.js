const Ajv = require('ajv')

const ajv = new Ajv()

const eventId = {
  title: 'Input event (internal)',
  type: 'string',
  default: 'nmea0183',
}
const protocol = {
  title: 'Connection Protocol',
  type: 'string',
  enum: ['tcp', 'udp'],
}
const port = {
  type: 'number',
  title: 'Port used for connections',
  default: 2000,
  maximum: 0xFFFF, // Max 16 bit int (65535).
}
// const broadcast = {
//   type: 'boolean',
//   title: 'Broadcast on local network',
//   default: false,
// }
const hostname = {
  title: 'Hostname or IP',
  type: 'string',
  format: 'hostname',
}
const udp = {
  title: 'UDP event watcher/dispatcher',
  type: 'object',
  properties: {
    eventId,
    protocol: { const: 'udp' },
    port,
    hostname,
    // tx: { const: true },
  },
  required: ['eventId', 'protocol', 'port', 'hostname'],
}
const tcp = {
  title: 'TCP event watcher/dispatcher',
  type: 'object',
  properties: {
    eventId, protocol: { const: 'tcp' }, port,
  },
  required: ['eventData', 'protocol', 'port'],
}
const netRelay = {
  type: 'object',
  required: ['eventId', 'protocol', 'port'],
  properties: { eventId, protocol, port },
  dependencies: {
    protocol: {
      oneOf: [
        { properties: { protocol: { enum: ['tcp'] } } },
        {
          properties: {
            protocol: { enum: ['udp'] },
            hostname,
          },
          required: ['hostname'],
        },
      ],
    },
  },
}

const schema = {
  title: 'Send internal event to a TCP or UDP Endpoint.',
  description: 'Used to send NMEA or other specific event types over an IP network.',
  type: 'array',
  items: netRelay,
  minItems: 1,
  uniqueItems: true,
}

module.exports = {
  udp,
  tcp,
  schema,
  validate: ajv.compile(schema),
  isUdpProp: ajv.compile(udp),
}
