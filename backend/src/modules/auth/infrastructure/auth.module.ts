import { Module } from '@nestjs/common';
import { AuthService } from '@modules/auth/application/auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
