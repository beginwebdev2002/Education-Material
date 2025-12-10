import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Configs from './configs/configs';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL ?? ""),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configs],
    }),
    TasksModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
  }
}
