import { UsersModule } from '@/modules/users/infrastructure/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Configs from './configs/configs';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { SeedModule } from './modules/seed/seed.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configs],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log('config: ', configService.get('database'));
  }
}
