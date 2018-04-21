/* globals describe test expect */
const { uiSchema } = require('./ui-schema')

const expected = {
  events: {
    items: {
      hostname: {
        'ui:help': {
          props: {
            children: [
              'If you want to broadcast to the entire network try using ',
              { props: { children: '127.0.0.255' }, type: 'code' },
              ' for an IP address.',
            ],
          },
          type: 'p',
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
