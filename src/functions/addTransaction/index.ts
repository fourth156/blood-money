import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';
import type { AWS } from '@serverless/typescript';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'transaction/add',
        request: {
          schemas: {
            'application/json': schema
          }
        },
        cors: true
      }
    },
    {
      http: {
        method: 'options',
        path: 'transaction/add',
        cors: true
      }
    }
  ],
} as AWS['functions'][''];
