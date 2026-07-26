import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../application/users.service';
import { UsersController } from './users.controller';
import { Users, UserSchema } from '../domain/users.schema';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  imports: [MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }])],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository, UsersService],
})
export class UsersModule { }
