import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Users, UserSchema } from '@modules/users/entities/users.schema';
import { UsersController } from '@modules/users/users.controller';
import { UsersService } from '@modules/users/users.service';
import { createUsersAvatarMulterOptions } from '@modules/users/users-multer.config';
import { RolesGuard } from '@common/guards/roles.guard';
import { ActivityModule } from '@modules/activity/activity.module';

@Module({
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => createUsersAvatarMulterOptions(config),
      inject: [ConfigService],
    }),
    ActivityModule,
  ],
  providers: [UsersService, RolesGuard],
  exports: [UsersService, RolesGuard],
})
export class UsersModule { }
