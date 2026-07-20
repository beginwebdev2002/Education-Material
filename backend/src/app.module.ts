import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configs } from '@configs';
import { UsersModule } from '@features/users';
import { AuthModule } from '@features/auth';
import { SeedModule } from '@features/seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configs],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.host'),
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
