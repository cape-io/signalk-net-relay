const { flow } = require('lodash/fp')
const { getBroadcastIp } = require('./utils')

const getUiSchema = broadcastIp => ({
  items: {
    hostname: {
      'ui:help': {
        type: 'p',
        props: {
          children: [
            'If you want to broadcast to the entire network try using ',
            { type: 'code', props: { children: broadcastIp } },
            ' for an IP address.',
          ],
        },
      },
    },
  },
})

module.exports = {
  uiSchema: flow(getBroadcastIp, getUiSchema),
  getUiSchema,
}
