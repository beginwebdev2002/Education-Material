import { Module } from '@nestjs/common';
import { SeedService } from '@modules/seed/seed.service';
import { UsersModule } from '@modules/users/users.module';
import { AutocompleteModule } from '@modules/autocomplete/autocomplete.module';

@Module({
  imports: [UsersModule, AutocompleteModule],
  providers: [SeedService],
})
export class SeedModule {}
