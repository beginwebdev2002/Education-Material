import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

import { SignupDto } from '@modules/auth/dto/signup.dto';
import { SigninDto } from '@modules/auth/dto/signin.dto';
import { AuthService } from '@modules/auth/auth.service';
import type { JwtPayload } from '@modules/auth/jwt-payload.interface';

function requestMeta(req: Request) {
    return { ip: req.ip, userAgent: req.headers['user-agent'] as string | undefined };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly config: ConfigService,
    ) { }

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user and set the session cookie' })
    async signup(
        @Body() createUserDto: SignupDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.signup(createUserDto, requestMeta(req));
        this.setCookieToken(res, result.accessToken);
        return result;
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in and set the session cookie' })
    async signin(
        @Body() body: SigninDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.signin(body, requestMeta(req));
        this.setCookieToken(res, result.accessToken);
        return result;
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Clear the session cookie' })
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = req.user as JwtPayload;
        await this.authService.logout(user._id, requestMeta(req));
        res.clearCookie('jwt_token', {
            httpOnly: this.config.get('cookies.httpOnly'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
        });
        return { success: true };
    }

    private setCookieToken(res: Response, token: string) {
        res.cookie('jwt_token', token, {
            httpOnly: this.config.get('cookies.httpOnly'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
            maxAge: this.config.get('cookies.maxAge')
        });
    }
}
