import { Test, TestingModule } from '@nestjs/testing';
<<<<<<< HEAD:backend/src/modules/auth/infrastructure/auth.controller.spec.ts
import { AuthController } from './auth.controller';
import { AuthService } from '@modules/auth/application/auth.service';
=======
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from '@modules/auth/auth.service';
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:backend/src/modules/auth/auth.controller.spec.ts

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
<<<<<<< HEAD:backend/src/modules/auth/infrastructure/auth.controller.spec.ts
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
            refresh: jest.fn(),
            logoutByCookie: jest.fn(),
          },
        },
=======
        { provide: AuthService, useValue: { signup: jest.fn(), signin: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:backend/src/modules/auth/auth.controller.spec.ts
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
