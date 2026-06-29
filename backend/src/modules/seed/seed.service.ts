import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '@modules/users/infrastructure/users.repository';
import { UserRole } from '@modules/users/domain/user.interface';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async onApplicationBootstrap() {
    this.logger.log('Checking for admin user...');
    try {
      const email = 'admin@edugen.tj';
      const password = '3255443345';
      const existingAdmin = await this.usersRepository.findByEmail(email);

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersRepository.create({
          email,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
        });
        
        const createdAdmin = await this.usersRepository.findByEmail(email);
        if (createdAdmin) {
           await this.usersRepository.update(createdAdmin._id, { role: UserRole.ADMIN });
        }
        
        this.logger.log('Admin user successfully created.');
      } else {
        this.logger.log('Admin user already exists.');
      }
    } catch (error) {
      this.logger.error('Failed to seed admin user', error);
    }
  }
}
