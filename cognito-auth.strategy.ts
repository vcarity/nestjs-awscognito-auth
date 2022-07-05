import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

interface Claim {
  sub: string;
  email: string;
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username: string;
  client_id: string;
}

@Injectable()
export class CognitoAuthStrategy extends PassportStrategy(
  Strategy,
  'cognito-auth',
) {
  constructor(
    private readonly configService: ConfigService<
      {
        COGNITO_CLIENT_ID: string;
        COGNITO_AUTHORITY: string;
      },
      true
    >,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: configService.get<string>('COGNITO_CLIENT_ID', {
        infer: true,
      }),
      issuer: configService.get<string>('COGNITO_AUTHORITY', {
        infer: true,
      }),
      // algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>('COGNITO_AUTHORITY', {
          infer: true,
        })}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: Claim): Promise<string> {
    return payload.email;
  }
}
