import { Request } from 'express';
import { JwtPayload } from '@features/auth';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}