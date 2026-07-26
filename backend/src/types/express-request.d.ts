
import { Request } from 'express';
import { JwtPayload } from '@modules/auth/jwt-payload.interface';


declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
