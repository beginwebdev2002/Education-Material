import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '@modules/users/infrastructure/users.repository';
import { MaterialsRepository } from '@modules/materials/infrastructure/materials.repository';
import { CommentsRepository } from '@modules/comments/infrastructure/comments.repository';
import { ActivityService } from '@modules/activity/application/activity.service';
import { ActivityType } from '@modules/activity/domain/activity.interface';
import { MaterialStatus } from '@modules/materials/domain/material.interface';

@Injectable()
export class AdminService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly materialsRepository: MaterialsRepository,
        private readonly commentsRepository: CommentsRepository,
        private readonly activityService: ActivityService,
        private readonly config: ConfigService,
    ) { }

    private onlineSince(): Date {
        const minutes = this.config.get<number>('presence.onlineThresholdMinutes')!;
        return new Date(Date.now() - minutes * 60 * 1000);
    }

    private activeSince(): Date {
        const days = this.config.get<number>('presence.activeThresholdDays')!;
        return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    }

    async overview() {
        const [
            totalUsers,
            onlineUsersCount,
            activeUsers7d,
            totalMaterials,
            publishedMaterials,
            pendingMaterials,
            totalDownloads,
            totalComments,
            recentActivity,
        ] = await Promise.all([
            this.usersRepository.countAll(),
            this.usersRepository.countOnlineSince(this.onlineSince()),
            this.usersRepository.countActiveSince(this.activeSince()),
            this.materialsRepository.countAll(),
            this.materialsRepository.countByStatus(MaterialStatus.PUBLISHED),
            this.materialsRepository.countByStatus(MaterialStatus.PENDING),
            this.materialsRepository.sumDownloads(),
            this.commentsRepository.countAll(),
            this.activityService.findRecent(20),
        ]);

        return {
            totalUsers,
            onlineUsersCount,
            activeUsers7d,
            totalMaterials,
            publishedMaterials,
            pendingMaterials,
            totalDownloads,
            totalComments,
            recentActivity,
        };
    }

    async onlineUsers() {
        return this.usersRepository.findOnlineSince(this.onlineSince(), 50);
    }

    async analytics(days: number) {
        const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const [registrationsSeries, downloadsSeries, activityBreakdown, topMaterials] = await Promise.all([
            this.usersRepository.registrationsSeriesSince(sinceDate),
            this.activityService.dailySeriesSince(ActivityType.MATERIAL_DOWNLOAD, sinceDate),
            this.activityService.activityBreakdownSince(sinceDate),
            this.materialsRepository.topByDownloads(5),
        ]);

        return { registrationsSeries, downloadsSeries, activityBreakdown, topMaterials };
    }

    async activityLog(page: number, limit: number, type?: ActivityType) {
        return this.activityService.findPaginated({ page, limit, type });
    }
}
