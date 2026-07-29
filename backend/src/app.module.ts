import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Configs from '@configs/configs';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { SeedModule } from '@modules/seed/seed.module';
import { ActivityModule } from '@modules/activity/activity.module';
import { AutocompleteModule } from '@modules/autocomplete/autocomplete.module';
import { MaterialsModule } from '@modules/materials/materials.module';
import { CommentsModule } from '@modules/comments/comments.module';
import { AdminModule } from '@modules/admin/admin.module';
import { PresenceModule } from '@modules/presence/presence.module';
import { LastSeenInterceptor } from '@common/interceptors/last-seen.interceptor';

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
    ActivityModule,
    AutocompleteModule,
    MaterialsModule,
    CommentsModule,
    AdminModule,
    PresenceModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: LastSeenInterceptor },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log('config: ', configService.get('database'));
  }
}
