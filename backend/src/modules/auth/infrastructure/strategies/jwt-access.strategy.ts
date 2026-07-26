import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "@modules/auth/domain/jwt.payload";
import { UsersRepository } from "@modules/users/infrastructure/users.repository";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly config: ConfigService,
        private readonly usersRepository: UsersRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('jwt.access.secret'),
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        // Fire-and-forget presence tracking; must not block or fail the request.
        void this.usersRepository.touchLastSeen(payload.sub);
        return payload;
    }
}
