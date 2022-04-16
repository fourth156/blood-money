import type { AWS } from '@serverless/typescript';

import { addTransaction, queryTransaction } from '@functions';
import tables from '@tables';
import cognito from '@cognito';

export const serverlessConfiguration: AWS = {
  service: 'blood-money',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-southeast-1',
    apiGateway: {
      minimumCompressionSize: 256,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      STAGE: '${opt:stage, "dev"}',
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: 'adminRole',
    },
  },
  // import the function via paths
  functions: {addTransaction, queryTransaction},
  resources: {
    Resources: {
      ...cognito,
      ...tables,
      adminRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: 'adminRole',
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com',
                },
                Action: 'sts:AssumeRole',
              },
            ],
          },
          Policies: [
            {
              PolicyName: 'adminPolicy',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: '*',
                    Resource: '*',
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
  package: {individually: true},
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: {'require.resolve': undefined},
      platform: 'node',
      concurrency: 10,
    },
    stage: '${opt:stage, "dev"}',
  },
};

module.exports = serverlessConfiguration;
