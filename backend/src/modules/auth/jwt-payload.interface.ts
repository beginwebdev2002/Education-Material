import { UserRole } from '@modules/users/domain/user.interface';

export interface JwtPayload {
    sub: string;
    email: string;
<<<<<<< HEAD:backend/src/modules/auth/domain/jwt.payload.ts
    role: UserRole;
}

export interface JwtRefreshPayload {
    sub: string;
    jti: string;
=======
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:backend/src/modules/auth/jwt-payload.interface.ts
}
