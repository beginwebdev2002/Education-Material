import { UsersRepository } from '@/modules/users/infrastructure/users.repository';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { Response, Request } from 'express'

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private config: ConfigService,
        private jwtService: JwtService
    ) { }

    async create(createUserDto: SignupDto, res: Response) {
        const { saltRounds } = this.config.get('bcrypt');
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(createUserDto.password, salt);
        const result = await this.usersRepository.create({ ...createUserDto, password: hash });
        const payload = { _id: result.id, email: result.email };
        const accessToken = await this.jwtService.signAsync(payload);
        this.setCookieToken(res, accessToken);
        return {
            accessToken,
            ...result.toObject()
        };
    }

    async login(loginUserDto: SigninDto) {
        const user = await this.usersRepository.findByEmail(loginUserDto.email);
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Invalid password');
        }
        const payload = { _id: user.id, email: user.email };
        return {
            accessToken: await this.jwtService.signAsync(payload),
            ...user.toObject()
        };
    }

    private setCookieToken(res: Response, token: string) {
        res.cookie('jwt_token', token, {
            httpOnly: this.config.get('cookies.httpOnly'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
            maxAge: this.config.get('cookies.maxAge')
        });
    }

    private parseCookieToken(req: Request): string {
        const token: string = req.cookies.token;
        if (!token) {
            throw new UnauthorizedException();
        }

        const user = this.jwtService.verify(token);
        return user;
    }
}
