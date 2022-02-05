import { CognitoUserPoolClient } from './type';

export default {
  Type: 'AWS::Cognito::UserPoolClient',
  Properties: {
    ClientName: '${self:custom.stage}-blood-money',
    GenerateSecret: false,
    UserPoolId: {
      Ref: 'UserPool'
    }
  },
} as CognitoUserPoolClient