import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from '@features/users';
import { USERS_REPOSITORY } from '@features/users';
import { SigninDto } from '@features/auth/application/dto/signin.dto';
import { JwtPayload } from '@features/auth/domain/jwt.payload';

@Injectable()
export class SigninUseCase {
    constructor(
        @Inject(USERS_REPOSITORY) private readonly usersRepository: IUserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async execute(signinDto: SigninDto) {
        const user = await this.usersRepository.findByEmail(signinDto.email);
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
