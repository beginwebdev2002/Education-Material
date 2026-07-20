import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@features/users/application/ports/outbound/users-repository.port';
import { USERS_REPOSITORY } from '@features/users/application/ports/outbound/users-repository.port';
import type { JwtPayload } from '@features/auth/domain/jwt.payload';

@Injectable()
export class GetProfileUseCase {
    constructor(
        @Inject(USERS_REPOSITORY) private readonly usersRepository: IUserRepository,
    ) { }

    async execute(payload: JwtPayload) {
        return this.usersRepository.findById(payload._id);
    }
}
