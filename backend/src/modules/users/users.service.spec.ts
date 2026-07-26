import { Test, TestingModule } from '@nestjs/testing';
<<<<<<< HEAD:backend/src/modules/users/application/users.service.spec.ts
import { ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from '@modules/users/infrastructure/users.repository';
import { UserRole } from '@modules/users/domain/user.interface';
=======
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { Users } from '@modules/users/entities/users.schema';
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:backend/src/modules/users/users.service.spec.ts

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: { setRole: jest.Mock; setBanned: jest.Mock; delete: jest.Mock };

  beforeEach(async () => {
    usersRepository = {
      setRole: jest.fn(),
      setBanned: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD:backend/src/modules/users/application/users.service.spec.ts
      providers: [UsersService, { provide: UsersRepository, useValue: usersRepository }],
=======
      providers: [
        UsersService,
        { provide: getModelToken(Users.name), useValue: { findById: jest.fn(), findByIdAndUpdate: jest.fn() } },
      ],
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:backend/src/modules/users/users.service.spec.ts
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('prevents an admin from changing their own role', async () => {
    await expect(service.updateRole('admin-1', 'admin-1', UserRole.USER)).rejects.toThrow(ForbiddenException);
    expect(usersRepository.setRole).not.toHaveBeenCalled();
  });

  it('prevents an admin from banning themselves', async () => {
    await expect(service.setBanned('admin-1', 'admin-1', true)).rejects.toThrow(ForbiddenException);
    expect(usersRepository.setBanned).not.toHaveBeenCalled();
  });
});
