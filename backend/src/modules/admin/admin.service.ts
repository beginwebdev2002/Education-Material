import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { MaterialsService } from '@modules/materials/materials.service';
import { CommentsService } from '@modules/comments/comments.service';
import { ActivityService } from '@modules/activity/activity.service';
import { ActivityType } from '@modules/activity/activity.interface';
import { MaterialStatus } from '@modules/materials/material.interface';

@Injectable()
export class AdminService {
    constructor(
        private readonly usersService: UsersService,
        private readonly materialsService: MaterialsService,
        private readonly commentsService: CommentsService,
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
            this.usersService.countAll(),
            this.usersService.countOnlineSince(this.onlineSince()),
            this.usersService.countActiveSince(this.activeSince()),
            this.materialsService.countAll(),
            this.materialsService.countByStatus(MaterialStatus.PUBLISHED),
            this.materialsService.countByStatus(MaterialStatus.PENDING),
            this.materialsService.sumDownloads(),
            this.commentsService.countAll(),
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
        return this.usersService.findOnlineSince(this.onlineSince(), 50);
    }

    async analytics(days: number) {
        const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const [registrationsSeries, downloadsSeries, activityBreakdown, topMaterials] = await Promise.all([
            this.usersService.registrationsSeriesSince(sinceDate),
            this.activityService.dailySeriesSince(ActivityType.MATERIAL_DOWNLOAD, sinceDate),
            this.activityService.activityBreakdownSince(sinceDate),
            this.materialsService.topByDownloads(5),
        ]);

        return { registrationsSeries, downloadsSeries, activityBreakdown, topMaterials };
    }

    async activityLog(page: number, limit: number, type?: ActivityType) {
        return this.activityService.findPaginated({ page, limit, type });
    }
}
