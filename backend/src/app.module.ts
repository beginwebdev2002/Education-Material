import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import Configs from './configs/configs';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL ?? ""),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configs],
    }),
    TasksModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
  }
}
