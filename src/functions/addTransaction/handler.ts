import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { putItem } from '@libs/dynamoDB';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const addTransaction: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const response = await putItem('transaction', event.body)
  return formatJSONResponse({
    response,
    event,
  });
}

export const main = middyfy(addTransaction);
