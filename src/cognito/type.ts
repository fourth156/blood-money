import { AwsCfRef } from '@serverless/typescript'

export type CognitoUserPool = {
  Type: 'AWS::Cognito::UserPool',
  Properties: {
    MfaConfiguration: 'OFF' | 'ON',
    UserPoolName: string,
    UsernameAttributes: string[],
    Policies: {
      PasswordPolicy: {
        MinimumLength: number,
        RequireLowercase: boolean,
        RequireNumbers: boolean,
        RequireSymbols: boolean,
        RequireUppercase: boolean,
      },
    },
  },
}

export type CognitoUserPoolClient = {
  Type: 'AWS::Cognito::UserPoolClient',
  Properties: {
    ClientName: string,
    GenerateSecret: boolean,
    UserPoolId: AwsCfRef
  },
}