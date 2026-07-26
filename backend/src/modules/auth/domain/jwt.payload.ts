import { UserRole } from '@modules/users/domain/user.interface';

export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}

export interface JwtRefreshPayload {
    sub: string;
    jti: string;
}
