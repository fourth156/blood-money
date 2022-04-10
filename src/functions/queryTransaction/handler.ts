import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { queryItems } from '@libs/dynamoDB';
import schema from './schema';

const addTransaction: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(JSON.stringify(event, null, 2));
  const { query, filter } = event.body;

  let response = {};
  
  response = await queryItems('transaction', query as any)

  return formatJSONResponse({response});
}

export const main = middyfy(addTransaction);
