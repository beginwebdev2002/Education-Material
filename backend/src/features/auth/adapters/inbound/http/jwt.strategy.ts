import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';
import { Request } from 'express'
import { JwtPayload } from "@features/auth/domain/jwt.payload";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private config: ConfigService
    ) {
        super({
            jwtFromRequest: (req: Request) => {
                return req.cookies && req.cookies['jwt_token'] ? req.cookies['jwt_token'] : null;
            },
            ignoreExpiration: false,
            secretOrKey: config.get('jwt.secret'),
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        return payload;
    }
}
