import { DynamoDBTable, defineAttribute, defineKeySchema } from './type';

export default {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: '${self:custom.stage}-transaction',
    AttributeDefinitions: [
      defineAttribute('id', 'S'),
      defineAttribute('from', 'S'),
      defineAttribute('to', 'S'),
    ],
    KeySchema: [defineKeySchema('id', 'HASH')],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'from-index',
        KeySchema: [defineKeySchema('from', 'HASH')],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
      {
        IndexName: 'to-index',
        KeySchema: [defineKeySchema('to', 'HASH')],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  }
} as DynamoDBTable;