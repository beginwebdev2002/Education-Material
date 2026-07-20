import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import { SignupDto } from '@features/auth/application/dto/signup.dto';
import { SigninDto } from '@features/auth/application/dto/signin.dto';
import { SignupUseCase } from '@features/auth/application/use-cases/signup.use-case';
import { SigninUseCase } from '@features/auth/application/use-cases/signin.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly signupUseCase: SignupUseCase,
        private readonly signinUseCase: SigninUseCase,
        private readonly config: ConfigService,
    ) { }

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user and set the session cookie' })
    async signup(
        @Body() createUserDto: SignupDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.signupUseCase.execute(createUserDto);
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
        const result = await this.signinUseCase.execute(body);
        this.setCookieToken(res, result.accessToken);
        return result;
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
