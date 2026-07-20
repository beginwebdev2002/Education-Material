import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@features/auth';
// Deep import (not the `@features/users` barrel) is deliberate: the barrel re-exports
// users.module.ts, which provides RolesGuard — going through it here would create a
// circular require (common -> users -> common) and USERS_REPOSITORY would be undefined
// at decorator-evaluation time.
import type { IUserRepository } from '@features/users/application/ports/outbound/users-repository.port';
import { USERS_REPOSITORY } from '@features/users/application/ports/outbound/users-repository.port';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(USERS_REPOSITORY) private readonly usersRepository: IUserRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const payload = request.user as JwtPayload;
    const user = await this.usersRepository.findById(payload._id);

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
