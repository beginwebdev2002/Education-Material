import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from '@modules/users/infrastructure/users.repository';
import { UserRole } from '@modules/users/domain/user.interface';

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
      providers: [UsersService, { provide: UsersRepository, useValue: usersRepository }],
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
