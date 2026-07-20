import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from '@features/users';
import { USERS_REPOSITORY } from '@features/users';
import { SignupDto } from '@features/auth/application/dto/signup.dto';
import { JwtPayload } from '@features/auth/domain/jwt.payload';

@Injectable()
export class SignupUseCase {
    constructor(
        @Inject(USERS_REPOSITORY) private readonly usersRepository: IUserRepository,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    async execute(signupDto: SignupDto) {
        const { saltRounds } = this.config.get('bcrypt');
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(signupDto.password, salt);
        const result = await this.usersRepository.create({ ...signupDto, password: hash });
        const payload: JwtPayload = { _id: result.id, email: result.email };
        const accessToken = await this.jwtService.signAsync(payload);
        const { password, ...userWithoutPassword } = result.toObject();
        return {
            accessToken,
            ...userWithoutPassword,
        };
    }
}
