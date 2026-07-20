import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '@features/users';

@Module({
  imports: [UsersModule],
  providers: [SeedService],
})
export class SeedModule {}
