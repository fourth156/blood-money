import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { putItem } from '@libs/dynamoDB';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const addTransaction: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(JSON.stringify(event, null, 2));
  const { transactions } = event.body;

  if (transactions.length === 0) {
    return formatJSONResponse({
      statusCode: 400,
      body: JSON.stringify({
        message: 'transactions is empty',
      }),
    });
  }

  const response = await Promise.all(transactions.map(t => putItem('transaction', t)));

  return formatJSONResponse({response});
}

export const main = middyfy(addTransaction);
