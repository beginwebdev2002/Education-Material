import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@modules/auth/jwt-payload.interface';
import { UsersService } from '@modules/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
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
    const user = await this.usersService.findById(payload._id);

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
