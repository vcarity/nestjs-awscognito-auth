import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthUsersService } from '@modules/auth-users/auth-users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CognitoAuthStrategy } from '@modules/auth-users/cognito-auth.strategy';

@Module({
  imports: [ConfigModule, PassportModule, JwtModule],
  providers: [AuthUsersService, CognitoAuthStrategy],
  exports: [AuthUsersService],
})
export class AuthUsersModule {}
