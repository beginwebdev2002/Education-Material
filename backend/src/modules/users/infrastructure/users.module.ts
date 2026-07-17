import { Module } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from '../domain/users.schema';
import { UsersRepository } from './users.repository';
import { RolesGuard } from '@common/guards/roles.guard';
@Module({
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UsersRepository, RolesGuard],
  exports: [UsersRepository]
})
export class UsersModule { }
