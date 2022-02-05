import { CognitoUserPool } from './type';

export default {
  Type: 'AWS::Cognito::UserPool',
  Properties: {
    MfaConfiguration: 'OFF',
    UserPoolName: '${self:custom.stage}-blood-money',
    UsernameAttributes: ['email'],
    Policies: {
      PasswordPolicy: {
        MinimumLength: 6,
        RequireLowercase: false,
        RequireNumbers: false,
        RequireSymbols: false,
        RequireUppercase: false,
      },
    },
  },
} as CognitoUserPool;