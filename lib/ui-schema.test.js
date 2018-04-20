/* globals describe test expect */
const { uiSchema } = require('./ui-schema')

const expected = {
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
                children: '127.0.0.255',
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
    expect(uiSchema('lo')).toEqual(expected)
  })
})
