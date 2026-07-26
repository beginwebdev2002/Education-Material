import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from '@modules/users/application/dto/update-profile.dto';
import { UsersRepository } from '@modules/users/infrastructure/users.repository';
import { UserRole } from '@modules/users/domain/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async findAllPaginated(page: number, limit: number, search?: string) {
    return this.usersRepository.findAllPaginated({ page, limit, search });
  }

  async findOne(id: string) {
    return this.usersRepository.findById(id);
  }

  async getProfile(userId: string) {
    return this.usersRepository.findById(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.usersRepository.update(userId, dto);
  }

  async updateRole(actingAdminId: string, targetUserId: string, role: UserRole) {
    if (actingAdminId === targetUserId) {
      throw new ForbiddenException('You cannot change your own role');
    }
    const updated = await this.usersRepository.setRole(targetUserId, role);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async setBanned(actingAdminId: string, targetUserId: string, isBanned: boolean) {
    if (actingAdminId === targetUserId) {
      throw new ForbiddenException('You cannot ban yourself');
    }
    const updated = await this.usersRepository.setBanned(targetUserId, isBanned);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async remove(actingAdminId: string, targetUserId: string) {
    if (actingAdminId === targetUserId) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    return this.usersRepository.delete(targetUserId);
  }
}
