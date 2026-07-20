import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { UsersController } from './users.controller';
import { FindAllUsersUseCase } from '@features/users/application/use-cases/find-all-users.use-case';
import { FindOneUserUseCase } from '@features/users/application/use-cases/find-one-user.use-case';
import { UpdateUserUseCase } from '@features/users/application/use-cases/update-user.use-case';
import { RemoveUserUseCase } from '@features/users/application/use-cases/remove-user.use-case';
import { GetProfileUseCase } from '@features/users/application/use-cases/get-profile.use-case';
import { USERS_REPOSITORY } from '@features/users';
import { RolesGuard } from '@common';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: FindAllUsersUseCase, useValue: { execute: jest.fn() } },
        { provide: FindOneUserUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateUserUseCase, useValue: { execute: jest.fn() } },
        { provide: RemoveUserUseCase, useValue: { execute: jest.fn() } },
        { provide: GetProfileUseCase, useValue: { execute: jest.fn() } },
        Reflector,
        RolesGuard,
        { provide: USERS_REPOSITORY, useValue: { findById: jest.fn() } },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
