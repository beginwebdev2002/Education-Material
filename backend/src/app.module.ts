import { UsersModule } from '@/modules/users/infrastructure/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Configs from './configs/configs';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL ?? ""),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configs],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
  }
}
