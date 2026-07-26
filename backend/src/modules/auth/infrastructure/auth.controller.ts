import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';

import { SignupDto } from '@modules/auth/application/dto/signup.dto';
import { SigninDto } from '@modules/auth/application/dto/signin.dto';
import { AuthService } from '@modules/auth/application/auth.service';
import { JwtRefreshGuard } from '@modules/auth/infrastructure/guards/jwt-refresh.guard';
import { RefreshTokenContext } from '@modules/auth/infrastructure/strategies/jwt-refresh.strategy';

function requestMeta(req: Request) {
    return { ip: req.ip, userAgent: req.headers['user-agent'] as string | undefined };
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(
        @Body() dto: SignupDto,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
    ) {
        return this.authService.signup(dto, res, requestMeta(req));
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(
        @Body() dto: SigninDto,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
    ) {
        return this.authService.signin(dto, res, requestMeta(req));
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtRefreshGuard)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const context = req.user as unknown as RefreshTokenContext;
        return this.authService.refresh(context, res, requestMeta(req));
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        await this.authService.logoutByCookie(req, res);
    }
}
