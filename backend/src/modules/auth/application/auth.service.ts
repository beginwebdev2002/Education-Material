import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from '@modules/users/infrastructure/users.repository';
import { RefreshTokenRepository } from '@modules/auth/infrastructure/refresh-token.repository';
import { RefreshTokenContext } from '@modules/auth/infrastructure/strategies/jwt-refresh.strategy';
import { ActivityService } from '@modules/activity/application/activity.service';
import { ActivityType } from '@modules/activity/domain/activity.interface';
import { UserRole } from '@modules/users/domain/user.interface';
import { JwtPayload, JwtRefreshPayload } from '@modules/auth/domain/jwt.payload';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

export interface RequestMeta {
    ip?: string;
    userAgent?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly activityService: ActivityService,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    async signup(dto: SignupDto, res: Response, meta: RequestMeta) {
        const existing = await this.usersRepository.findByEmail(dto.email);
        if (existing) {
            throw new BadRequestException('Email is already registered');
        }

        const saltRounds = this.config.get<number>('bcrypt.saltRounds')!;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
        const user = await this.usersRepository.create({ ...dto, password: hashedPassword });

        const accessToken = await this.issueSession(user.id as string, user.email, user.role, res, meta);
        await this.activityService.log({ userId: user.id as string, type: ActivityType.REGISTER, ip: meta.ip, userAgent: meta.userAgent });

        return { accessToken, user: user.toJSON() };
    }

    async signin(dto: SigninDto, res: Response, meta: RequestMeta) {
        const user = await this.usersRepository.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (user.isBanned) {
            throw new ForbiddenException('This account has been suspended');
        }

        const accessToken = await this.issueSession(user.id as string, user.email, user.role, res, meta);
        await this.activityService.log({ userId: user.id as string, type: ActivityType.LOGIN, ip: meta.ip, userAgent: meta.userAgent });

        return { accessToken, user: user.toJSON() };
    }

    async refresh(context: RefreshTokenContext, res: Response, meta: RequestMeta) {
        // Rotation: the presented refresh token is single-use.
        await this.refreshTokenRepository.revokeById(context.refreshTokenId);

        const user = await this.usersRepository.findById(context.sub);
        if (!user || user.isBanned) {
            throw new UnauthorizedException();
        }

        const accessToken = await this.issueSession(user.id as string, user.email, user.role, res, meta);
        return { accessToken, user: user.toJSON() };
    }

    async logoutByCookie(req: Request, res: Response): Promise<void> {
        const cookieName = this.config.get<string>('refreshCookie.name')!;
        const rawToken: string | undefined = req.cookies?.[cookieName];

        if (rawToken) {
            const stored = await this.refreshTokenRepository.findValidByRawToken(rawToken);
            if (stored) {
                await this.refreshTokenRepository.revokeById(stored.id as string);
            }
        }

        this.clearRefreshCookie(res);
    }

    private async issueSession(userId: string, email: string, role: UserRole, res: Response, meta: RequestMeta): Promise<string> {
        const accessPayload: JwtPayload = { sub: userId, email, role };
        const accessToken = await this.jwtService.signAsync(accessPayload, {
            secret: this.config.get<string>('jwt.access.secret'),
            expiresIn: this.config.get<string>('jwt.access.expiresIn'),
        } as JwtSignOptions);

        const jti = randomUUID();
        const refreshPayload: JwtRefreshPayload = { sub: userId, jti };
        const refreshToken = await this.jwtService.signAsync(refreshPayload, {
            secret: this.config.get<string>('jwt.refresh.secret'),
            expiresIn: this.config.get<string>('jwt.refresh.expiresIn'),
        } as JwtSignOptions);

        const expiresInMs = this.config.get<number>('jwt.refresh.expiresInMs')!;
        await this.refreshTokenRepository.create({
            userId,
            rawToken: refreshToken,
            expiresAt: new Date(Date.now() + expiresInMs),
            userAgent: meta.userAgent,
            ip: meta.ip,
        });

        this.setRefreshCookie(res, refreshToken, expiresInMs);
        return accessToken;
    }

    private setRefreshCookie(res: Response, token: string, maxAge: number): void {
        res.cookie(this.config.get<string>('refreshCookie.name')!, token, {
            httpOnly: this.config.get<boolean>('refreshCookie.httpOnly'),
            secure: this.config.get<boolean>('refreshCookie.secure'),
            sameSite: this.config.get('refreshCookie.sameSite'),
            path: this.config.get<string>('refreshCookie.path'),
            maxAge,
        });
    }

    private clearRefreshCookie(res: Response): void {
        res.clearCookie(this.config.get<string>('refreshCookie.name')!, {
            httpOnly: this.config.get<boolean>('refreshCookie.httpOnly'),
            secure: this.config.get<boolean>('refreshCookie.secure'),
            sameSite: this.config.get('refreshCookie.sameSite'),
            path: this.config.get<string>('refreshCookie.path'),
        });
    }
}
