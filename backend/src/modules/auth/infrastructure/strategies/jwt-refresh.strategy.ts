import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtRefreshPayload } from "@modules/auth/domain/jwt.payload";
import { RefreshTokenRepository } from "@modules/auth/infrastructure/refresh-token.repository";

export interface RefreshTokenContext {
    sub: string;
    jti: string;
    rawToken: string;
    refreshTokenId: string;
}

function extractRefreshCookie(config: ConfigService) {
    return (req: Request): string | null => {
        const cookieName = config.get<string>('refreshCookie.name')!;
        return req.cookies && req.cookies[cookieName] ? req.cookies[cookieName] : null;
    };
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly config: ConfigService,
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ) {
        super({
            jwtFromRequest: extractRefreshCookie(config),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('jwt.refresh.secret'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtRefreshPayload): Promise<RefreshTokenContext> {
        const cookieName = this.config.get<string>('refreshCookie.name')!;
        const rawToken: string | undefined = req.cookies?.[cookieName];
        if (!rawToken) {
            throw new UnauthorizedException('Refresh token is missing');
        }

        const storedToken = await this.refreshTokenRepository.findValidByRawToken(rawToken);
        if (!storedToken || storedToken.user.toString() !== payload.sub) {
            throw new UnauthorizedException('Refresh token is invalid or expired');
        }

        return {
            sub: payload.sub,
            jti: payload.jti,
            rawToken,
            refreshTokenId: storedToken.id as string,
        };
    }
}
