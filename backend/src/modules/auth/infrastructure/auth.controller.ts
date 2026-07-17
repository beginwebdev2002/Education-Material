import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { SignupDto } from '@modules/auth/application/dto/signup.dto';
import { AuthService } from '@modules/auth/application/auth.service';
import { SigninDto } from '@modules/auth/application/dto/signin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user and set the session cookie' })
    async signup(
        @Body() createUserDto: SignupDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.create(createUserDto, res);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in and set the session cookie' })
    async signin(
        @Body() body: SigninDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(body, res)
    }
}
