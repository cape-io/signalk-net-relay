const eventData = {
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
const broadcast = {
  type: 'boolean',
  title: 'Broadcast on local network',
  default: false,
}
const hostname = {
  title: 'Hostname or IP',
  type: 'string',
  format: 'hostname',
}

const netRelay = {
  type: 'object',
  required: ['eventData', 'protocol', 'port'],
  properties: { eventData, protocol, port },
  dependencies: {
    protocol: {
      oneOf: [
        { properties: { protocol: { enum: ['tcp'] } } },
        {
          properties: {
            protocol: { enum: ['udp'] },
            broadcast,
          },
          required: ['broadcast'],
        },
      ],
    },
    broadcast: {
      oneOf: [
        {
          properties: {
            broadcast: { enum: [true] },
          },
        },
        {
          properties: {
            broadcast: { enum: [false] },
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
}
// console.log(JSON.stringify(schema, null, 2))
module.exports = schema
