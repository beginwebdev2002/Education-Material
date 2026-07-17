import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '@modules/users/application/dto/update-user.dto';
import { UsersRepository } from '@modules/users/infrastructure/users.repository';
import { PaginatedUsers } from '@modules/users/domain/users.repository.interface';
import { UserRole } from '@modules/users/domain/user.interface';
import { JwtPayload } from '@modules/auth/domain/jwt.payload';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  async findAll(page: number, limit: number): Promise<PaginatedUsers> {
    return this.usersRepository.findAll(page, limit);
  }

  async findOne(id: string) {
    return this.usersRepository.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto, requester: JwtPayload) {
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

  async remove(id: string) {
    return this.usersRepository.delete(id);
  }

  async getProfile(payload: JwtPayload) {
    return this.usersRepository.findById(payload._id);
  }
}
