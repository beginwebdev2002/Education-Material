import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';

export interface PresenceSnapshot {
    onlineCount: number;
}

@Injectable()
export class PresenceService {
    constructor(
        private readonly usersService: UsersService,
        private readonly config: ConfigService,
    ) { }

    private onlineSince(): Date {
        const minutes = this.config.get<number>('presence.onlineThresholdMinutes')!;
        return new Date(Date.now() - minutes * 60 * 1000);
    }

    async getSnapshot(): Promise<PresenceSnapshot> {
        const onlineCount = await this.usersService.countOnlineSince(this.onlineSince());
        return { onlineCount };
    }
}
