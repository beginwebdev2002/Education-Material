import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@features/users/application/ports/outbound/users-repository.port';
import { USERS_REPOSITORY } from '@features/users/application/ports/outbound/users-repository.port';

@Injectable()
export class RemoveUserUseCase {
    constructor(
        @Inject(USERS_REPOSITORY) private readonly usersRepository: IUserRepository,
    ) { }

    async execute(id: string) {
        return this.usersRepository.delete(id);
    }
}
