import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

@Injectable()
export class AuthUsersService {
  private userPool: CognitoUserPool;

  constructor(
    private readonly configService: ConfigService<
      {
        COGNITO_CLIENT_ID: string;
        COGNITO_USER_POOL_ID: string;
      },
      true
    >,
  ) {
    this.userPool = new CognitoUserPool({
      ClientId: configService.get<string>('COGNITO_CLIENT_ID', {
        infer: true,
      }),
      UserPoolId: configService.get<string>('COGNITO_USER_POOL_ID', {
        infer: true,
      }),
    });
  }

  async registerUser(registerRequest: {
    name: string;
    email: string;
    password: string;
  }): Promise<unknown> {
    const { name, email, password } = registerRequest;
    const nameCognitoAttribute = new CognitoUserAttribute({
      Name: 'name',
      Value: name,
    });
    const emailCognitoAttribute = new CognitoUserAttribute({
      Name: 'email',
      Value: email,
    });
    const attributes = [nameCognitoAttribute, emailCognitoAttribute];

    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        attributes,
        null,
        (error, result) => {
          if (!result) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
    });
  }
}
