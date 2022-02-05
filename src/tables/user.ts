import { DynamoDBTable, defineAttribute, defineKeySchema } from './type';

export default {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: '${self:custom.stage}-user',
    AttributeDefinitions: [
      defineAttribute('id', 'S'),
      defineAttribute('email', 'S'),
    ],
    KeySchema: [defineKeySchema('id', 'HASH')],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [defineKeySchema('email', 'HASH')],
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