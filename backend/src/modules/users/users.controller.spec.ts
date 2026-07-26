import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { UsersController } from './users.controller';
import { UsersService } from '@modules/users/users.service';
import { RolesGuard } from '@common/guards/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
<<<<<<< HEAD:backend/src/modules/users/infrastructure/users.controller.spec.ts
            findAllPaginated: jest.fn(),
            findOne: jest.fn(),
            getProfile: jest.fn(),
            updateProfile: jest.fn(),
            updateRole: jest.fn(),
            setBanned: jest.fn(),
            remove: jest.fn(),
          },
        },
=======
            getProfile: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            updateAsUser: jest.fn(),
            delete: jest.fn(),
          },
        },
        Reflector,
        RolesGuard,
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:backend/src/modules/users/users.controller.spec.ts
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
