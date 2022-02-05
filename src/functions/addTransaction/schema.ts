export default {
  type: "object",
  properties: {
    from: { type: 'string' },
    to: { type: 'string' },
    amount: { type: 'number' }
  },
  required: ['from', 'to', 'amount']
} as const;
