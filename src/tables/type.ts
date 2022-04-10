export type DynamoDBTable = {
  Type: 'AWS::DynamoDB::Table';
  Properties: {
    TableName: string;
    AttributeDefinitions: AttributeDefinitions[];
    KeySchema: KeySchema[];
    ProvisionedThroughput: ProvisionedThroughput;
  };  
  GlobalSecondaryIndexes?: GlobalSecondaryIndex[];
  StreamSpecification?: StreamSpecification;
  Tags?: Tag[];
};

type AttributeDefinitions = {
  AttributeName: string;
  AttributeType: 'S' | 'N' | 'B';
};

type KeySchema = {
  AttributeName: string;
  KeyType: 'HASH' | 'RANGE';
};

type GlobalSecondaryIndex = {
  IndexName: string;
  KeySchema: KeySchema[];
  Projection: {
    ProjectionType: 'ALL' | 'KEYS_ONLY' | 'INCLUDE';
    NonKeyAttributes?: string[];
  };
  ProvisionedThroughput: ProvisionedThroughput;
};

type StreamSpecification = {
  StreamViewType: 'NEW_IMAGE' | 'OLD_IMAGE' | 'NEW_AND_OLD_IMAGES' | 'KEYS_ONLY';
};

type Tag = {
  Key: string;
  Value: string;
};

type ProvisionedThroughput = {
  ReadCapacityUnits: number;
  WriteCapacityUnits: number;
};

export const defineAttribute = (
  name: string,
  type: 'S' | 'N' | 'B'
): AttributeDefinitions => ({
  AttributeName: name,
  AttributeType: type,
});

export const defineKeySchema = (
  name: string,
  type: 'HASH' | 'RANGE'
): KeySchema => ({
  AttributeName: name,
  KeyType: type,
});

export type Query = {
  index: string;
  indexValue: string | number;
}