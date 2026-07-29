import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersService } from '@modules/users/users.service';
import type { JwtPayload } from '@modules/auth/jwt-payload.interface';

/**
 * Fire-and-forget lastSeenAt heartbeat for any authenticated request.
 * No-ops for unauthenticated requests (req.user is only populated behind an auth guard).
 */
@Injectable()
export class LastSeenInterceptor implements NestInterceptor {
    constructor(private readonly usersService: UsersService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const req = context.switchToHttp().getRequest<Request>();
        const user = req.user as JwtPayload | undefined;
        if (user?._id) {
            this.usersService.touchLastSeen(user._id).catch(() => undefined);
        }
        return next.handle();
    }
}
