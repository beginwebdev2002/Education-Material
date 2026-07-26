import { JwtPayload } from '@modules/auth/domain/jwt.payload';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
