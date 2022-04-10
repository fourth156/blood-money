export default {
  type: 'object',
  properties: {
    query: {
      type: 'object',
      properties: {
        index: {type: 'string'},
        indexValue: {type: 'string'},
      },
      additionalProperties: false,
    },
    filter: {
      type: 'object',
      properties: {
        from: {type: 'string'},
        to: {type: 'string'},
        refId: {type: 'string'},
      },
    },
  },
  required: ['query'],
  additionalProperties: false,
} as const;