import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { Users } from '@modules/users/entities/users.schema';
import { UserRole } from '@modules/users/user-role.enum';

describe('UsersService', () => {
  let service: UsersService;
  let usersModel: { findById: jest.Mock; findByIdAndUpdate: jest.Mock };

  beforeEach(async () => {
    usersModel = {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(Users.name), useValue: usersModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('prevents a non-admin, non-self caller from updating another user', async () => {
    usersModel.findById.mockReturnValue({
      select: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({ role: UserRole.USER }) }),
    });

    await expect(
      service.updateAsUser('target-1', {}, { _id: 'requester-1', email: 'requester@example.com' }),
    ).rejects.toThrow(ForbiddenException);
  });
});
