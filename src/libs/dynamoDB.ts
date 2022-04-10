import {DynamoDB} from 'aws-sdk';
import {nanoid} from 'nanoid';
import {BatchWriteItemInput, BatchWriteItemOutput, PutItemOutput} from 'aws-sdk/clients/dynamodb';
import { Query } from 'src/tables/type';

const { STAGE } = process.env;

const dbClient = new DynamoDB();

type NewItem = {
  [key: string]: unknown;
}

type BaseItem = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
} & NewItem;


export const putItem = async <T extends NewItem>(tableName: string, item: T, condition = 'attribute_not_exists(id)'): Promise<PutItemOutput> => {
  const params = preparePutItemStatement(getTableName(tableName), item, condition);
  console.log(JSON.stringify(params, null, 2));
  return await dbClient.putItem(params).promise();
};

export const batchPutItems = async <T extends NewItem>(
  tableName: string,
  items: T[]
): Promise<BatchWriteItemOutput> => {
  const params = {
    RequestItems: {
      [getTableName(tableName)]: items.map((item) => ({
        PutRequest: {Item: DynamoDB.Converter.marshall({...item, id: nanoid()}) },
      })),
    },
  } as BatchWriteItemInput;
  console.log(JSON.stringify(params, null, 2));
  return await dbClient.batchWriteItem(params).promise();
};

export const updateItem = async <T extends BaseItem>(tableName: string, item: T) => {
  try {
    const params = prepareUpdateItemStatement(tableName, item);
    console.log(JSON.stringify(params, null, 2));
    return await dbClient.updateItem(params).promise();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const queryItems = async (tableName: string, query: Query) => {
  try {
    const { index, indexValue } = query;
    const params = prepareQueryStatement(tableName, index, indexValue);
    console.log(JSON.stringify(params, null, 2));
    const result = await dbClient.query(params).promise();
    const items = result.Items.map(item => DynamoDB.Converter.unmarshall(item));
    return items;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

const getTableName = (tableName: string) => `${STAGE}-${tableName}`;
const getIndexName = (indexName: string) => `${indexName}-index`;

const prepareQueryStatement = (tableName: string, index: string, indexValue: any) => {
  const TableName = getTableName(tableName);
  const IndexName = getIndexName(index);
  const params = {
    KeyConditionExpression: `#${index} = :${index}`,
    ExpressionAttributeValues: {
      [`:${index}`]: DynamoDB.Converter.marshall({ [index]: indexValue })[index],
    },
    ExpressionAttributeNames: {
      [`#${index}`]: index,
    },
    IndexName,
    TableName,
  };

  return params;
};

const preparePutItemStatement = (tableName: string, item: NewItem, condition = 'attribute_not_exists(id)') => {
  const nowIso = new Date().toISOString();
  item.id = item.id || nanoid();
  item.createdAt = item.createdAt || nowIso;
  item.updatedAt = item.updatedAt || nowIso;
  const params = {
    Item: DynamoDB.Converter.marshall(item),
    TableName: tableName,
    ConditionExpression: condition,
  };
  return params;
};

const prepareUpdateItemStatement = (tableName: string, item: BaseItem) => {
  const nowIso = (new Date()).toISOString();
  item.updatedAt = item.updatedAt || nowIso;

  let expNames = {};
  let expValues = {};
  let expSet = [];
  let expRemove = [];

  Object.keys(item).forEach(attName => {
      if (attName !== "id") {
          expNames[`#${attName}`] = attName;
      }
      if (item[attName] == null) {
          expRemove.push(`#${attName}`);
      } else {
          if (attName !== "id") {
              let marshalled = DynamoDB.Converter.marshall({ attName: item[attName] });
              expValues[`:${attName}`] = marshalled.attName;
              expSet.push(`#${attName} = :${attName}`);
          }
      }
  });

  let removeExp = "";

  if (expRemove.length > 0) {
      removeExp = ` REMOVE ${expRemove.join(", ")}`;
  }

  let updateExpression = `SET ${expSet.join(", ")} ${removeExp}`;
  const params = {
      Key: {
          id: {
              "S": item.id
          }
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expNames,
      ExpressionAttributeValues: expValues,
      TableName: tableName
  };
  return params;
}