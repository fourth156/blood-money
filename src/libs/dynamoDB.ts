import {DynamoDB} from 'aws-sdk';
import {nanoid} from 'nanoid';
import {PutItemOutput} from 'aws-sdk/clients/dynamodb';

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


export const putItem = async <T extends NewItem>(tableName: string, item: T): Promise<PutItemOutput> => {
  const params = preparePutItemStatement(getTableName(tableName), item);
  console.log(JSON.stringify(params, null, 2));
  return await dbClient.putItem(params).promise();
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

const getTableName = (tableName: string) => `${STAGE}-${tableName}`;

const preparePutItemStatement = (tableName: string, item: NewItem) => {
  const nowIso = new Date().toISOString();
  item.id = item.id || nanoid();
  item.createdAt = item.createdAt || nowIso;
  item.updatedAt = item.updatedAt || nowIso;
  const params = {
    Item: DynamoDB.Converter.marshall(item),
    TableName: tableName,
    ConditionExpression: 'attribute_not_exists(id)',
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