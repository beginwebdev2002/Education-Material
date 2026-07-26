import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersRepository } from '@modules/users/infrastructure/users.repository';
import { RefreshTokenRepository } from '@modules/auth/infrastructure/refresh-token.repository';
import { ActivityService } from '@modules/activity/application/activity.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: { findByEmail: jest.Mock };

  beforeEach(async () => {
    usersRepository = { findByEmail: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: usersRepository },
        { provide: RefreshTokenRepository, useValue: {} },
        { provide: ActivityService, useValue: { log: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects signin for an unknown email', async () => {
    usersRepository.findByEmail.mockResolvedValue(null);
    await expect(
      service.signin({ email: 'missing@example.com', password: 'password123' }, {} as any, {}),
    ).rejects.toThrow(UnauthorizedException);
  });
});
