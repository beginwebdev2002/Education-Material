import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository, PaginatedUsers } from '@features/users/application/ports/outbound/users-repository.port';
import { USERS_REPOSITORY } from '@features/users/application/ports/outbound/users-repository.port';

@Injectable()
export class FindAllUsersUseCase {
    constructor(
        @Inject(USERS_REPOSITORY) private readonly usersRepository: IUserRepository,
    ) { }

    async execute(page: number, limit: number): Promise<PaginatedUsers> {
        return this.usersRepository.findAll(page, limit);
    }
}
