import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@features/users/application/ports/outbound/users-repository.port';
import { USERS_REPOSITORY } from '@features/users/application/ports/outbound/users-repository.port';
import { UpdateUserDto } from '@features/users/application/dto/update-user.dto';
import { UserRole } from '@features/users/domain/user.interface';
import type { JwtPayload } from '@features/auth/domain/jwt.payload';

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject(USERS_REPOSITORY) private readonly usersRepository: IUserRepository,
    ) { }

    async execute(id: string, updateUserDto: UpdateUserDto, requester: JwtPayload) {
        const requesterUser = await this.usersRepository.findById(requester._id);
        const isAdmin = requesterUser?.role === UserRole.ADMIN;
        const isSelf = requester._id === id;

        if (!isAdmin && !isSelf) {
            throw new ForbiddenException('You may only update your own profile.');
        }
        if (!isAdmin && updateUserDto.role !== undefined) {
            throw new ForbiddenException('Only an admin can change a user role.');
        }

        return this.usersRepository.update(id, updateUserDto);
    }
}
