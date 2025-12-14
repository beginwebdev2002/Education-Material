// src/types/express-request.d.ts

// Важно: если вы используете @nestjs/platform-express, 
// вы должны импортировать 'express', чтобы расширить его.
import { Request } from 'express';
// Импортируйте ваш интерфейс Payload, определенный в Auth Module
import { JwtPayload } from '@modules/auth/domain/jwt-payload.interface';

// Расширяем стандартный интерфейс Request из Express
declare global {
    namespace Express {
        // В NestJS используется Express.Request
        interface Request {
            // TypeScript теперь знает, что req.user существует 
            // и его тип — это наш JwtPayload
            user?: JwtPayload;
        }
    }
}