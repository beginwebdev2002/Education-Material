import { Request } from 'express';
import { JwtPayload } from '@modules/auth/domain/jwt-payload.interface';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}