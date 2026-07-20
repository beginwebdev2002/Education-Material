import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@modules/users/users.service';
import { SignupDto } from '@modules/auth/dto/signup.dto';
import { SigninDto } from '@modules/auth/dto/signin.dto';
import { JwtPayload } from '@modules/auth/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto) {
        const { saltRounds } = this.config.get('bcrypt');
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(signupDto.password, salt);
        const result = await this.usersService.create({ ...signupDto, password: hash });
        const payload: JwtPayload = { _id: result.id, email: result.email };
        const accessToken = await this.jwtService.signAsync(payload);
        const { password, ...userWithoutPassword } = result.toObject();
        return {
            accessToken,
            ...userWithoutPassword,
        };
    }

    async signin(signinDto: SigninDto) {
        const user = await this.usersService.findByEmail(signinDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(signinDto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const payload: JwtPayload = { _id: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);
        const { password, ...userWithoutPassword } = user.toObject();
        return {
            accessToken,
            ...userWithoutPassword,
        };
    }
}
