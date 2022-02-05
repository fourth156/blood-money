export default {
  type: 'object',
  properties: {
    transactions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          from: {type: 'string'},
          to: {type: 'string'},
          amount: {type: 'number'},
          refId: {type: 'string'},
        },
        required: ['from', 'to', 'amount', 'refId'],
        additionalProperties: false,
        minItems: 1,
        uniqueItems: true
      },
    },
  },
  required: ['transactions'],
  additionalProperties: false,
} as const;