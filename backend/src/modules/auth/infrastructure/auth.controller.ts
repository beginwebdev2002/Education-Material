import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { SignupDto } from '@modules/auth/application/dto/signup.dto';
import { AuthService } from '@modules/auth/application/auth.service';
import { SigninDto } from '@modules/auth/application/dto/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {

    }
    @Post('signup')
    async signup(
        @Body() createUserDto: SignupDto,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.create(createUserDto, res);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() body: SigninDto) {
        return this.authService.login(body)
    }
}
