import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from '@modules/users/entities/users.schema';
import { UsersController } from '@modules/users/users.controller';
import { UsersService } from '@modules/users/users.service';
import { RolesGuard } from '@common/guards/roles.guard';

@Module({
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
  ],
  providers: [UsersService, RolesGuard],
  exports: [UsersService],
})
export class UsersModule { }
