const { schema } = require('../lib/schema')
const { uiSchema } = require('../lib/ui-schema')

console.log(JSON.stringify(schema, null, 2))
console.log(JSON.stringify(uiSchema(), null, 2))
