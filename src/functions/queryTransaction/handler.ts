import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { queryItems, scanTable } from '@libs/dynamoDB';
import schema from './schema';

const addTransaction: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(JSON.stringify(event, null, 2));
  const { query, filter } = event.body;
  const { index, indexValue } = query;

  let response = {};
  if (index === 'ALL' && indexValue === 'ALL') {
    response = await scanTable('transaction');
  }
  else {
    response = await queryItems('transaction', query as any)
  }
  console.log('response' + JSON.stringify(response, null, 2));
  return formatJSONResponse({response});
}

export const main = middyfy(addTransaction);
