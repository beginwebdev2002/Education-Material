import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '@features/users';
import { AuthController } from '@features/auth/adapters/inbound/http/auth.controller';
import { JwtStrategy } from '@features/auth/adapters/inbound/http/jwt.strategy';
import { SignupUseCase } from '@features/auth/application/use-cases/signup.use-case';
import { SigninUseCase } from '@features/auth/application/use-cases/signin.use-case';

@Module({
  controllers: [AuthController],
  providers: [SignupUseCase, SigninUseCase, JwtStrategy],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule { }
