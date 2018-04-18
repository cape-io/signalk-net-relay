const { unary } = require('lodash/fp')
const { setField } = require('cape-lodash')
const { getBroadcastIp } = require('./utils')

const uiSchema = {
  items: {
    hostname: {
      'ui:help': {
        type: 'p',
        props: {
          children: [
            'If you want to broadcast to the entire network try using ',
            {
              type: 'code',
              props: {
                children: 'billing_address',
              },
            },
            ' for an IP address.',
          ],
        },
      },
    },
  },
}
const broadcastPath = 'items.hostname.ui:help.props.children[1].props.children'
const getUiSchema = setField(broadcastPath, unary(getBroadcastIp))
module.exports = {
  uiSchema,
  getUiSchema,
}
