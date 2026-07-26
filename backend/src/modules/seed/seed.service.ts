import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@modules/users/users.service';
import { UserRole } from '@modules/users/user-role.enum';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    this.logger.log('Checking for admin user...');
    try {
      const email = 'admin@edugen.tj';
      const password = '3255443345';
      const existingAdmin = await this.usersService.findByEmail(email);

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersService.create({
          email,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
        });

        const createdAdmin = await this.usersService.findByEmail(email);
        if (createdAdmin) {
           await this.usersService.update(createdAdmin._id, { role: UserRole.ADMIN });
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
