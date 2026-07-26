<<<<<<< HEAD
import { JwtPayload } from '@modules/auth/domain/jwt.payload';
=======
import { Request } from 'express';
import { JwtPayload } from '@modules/auth/jwt-payload.interface';
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
