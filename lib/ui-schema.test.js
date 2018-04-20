/* globals describe test expect */
const { getUiSchema } = require('./ui-schema')

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
                children: '192.168.4.255',
              },
            },
            ' for an IP address.',
          ],
        },
      },
    },
  },
}

describe('getUiSchema', () => {
  test('Adds the broadcast IP.', () => {
    expect(getUiSchema()).toEqual(uiSchema)
  })
})
