import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { PresenceGateway } from '@modules/presence/presence.gateway';
import { PresenceService } from '@modules/presence/presence.service';

@Module({
    imports: [UsersModule],
    providers: [PresenceGateway, PresenceService],
})
export class PresenceModule { }
