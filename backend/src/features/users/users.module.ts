import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from '@features/users/adapters/outbound/mongoose/users.schema';
import { UsersRepository } from '@features/users/adapters/outbound/mongoose/users.repository';
import { USERS_REPOSITORY } from '@features/users/application/ports/outbound/users-repository.port';
import { UsersController } from '@features/users/adapters/inbound/http/users.controller';
import { FindAllUsersUseCase } from '@features/users/application/use-cases/find-all-users.use-case';
import { FindOneUserUseCase } from '@features/users/application/use-cases/find-one-user.use-case';
import { UpdateUserUseCase } from '@features/users/application/use-cases/update-user.use-case';
import { RemoveUserUseCase } from '@features/users/application/use-cases/remove-user.use-case';
import { GetProfileUseCase } from '@features/users/application/use-cases/get-profile.use-case';
import { RolesGuard } from '@common';

@Module({
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
  ],
  providers: [
    { provide: USERS_REPOSITORY, useClass: UsersRepository },
    FindAllUsersUseCase,
    FindOneUserUseCase,
    UpdateUserUseCase,
    RemoveUserUseCase,
    GetProfileUseCase,
    RolesGuard,
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule { }
