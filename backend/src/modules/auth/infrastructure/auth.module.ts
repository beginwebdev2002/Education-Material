import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@modules/users/infrastructure/users.module';
import { ActivityModule } from '@modules/activity/activity.module';
import { AuthService } from '@modules/auth/application/auth.service';
import { AuthController } from './auth.controller';
import { RefreshToken, RefreshTokenSchema } from '@modules/auth/domain/refresh-token.schema';
import { RefreshTokenRepository } from './refresh-token.repository';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenRepository, JwtAccessStrategy, JwtRefreshStrategy],
  imports: [
    UsersModule,
    ActivityModule,
    PassportModule,
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
    JwtModule.register({ global: true }),
  ],
  exports: [AuthService],
})
export class AuthModule { }
