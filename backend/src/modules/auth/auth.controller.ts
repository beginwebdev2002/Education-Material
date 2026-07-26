import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import { SignupDto } from '@modules/auth/dto/signup.dto';
import { SigninDto } from '@modules/auth/dto/signin.dto';
import { AuthService } from '@modules/auth/auth.service';

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
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.signup(createUserDto);
        this.setCookieToken(res, result.accessToken);
        return result;
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in and set the session cookie' })
    async signin(
        @Body() body: SigninDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.signin(body);
        this.setCookieToken(res, result.accessToken);
        return result;
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Clear the session cookie' })
    logout(@Res({ passthrough: true }) res: Response) {
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
