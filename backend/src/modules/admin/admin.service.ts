import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { MaterialsService } from '@modules/materials/materials.service';
import { CommentsService } from '@modules/comments/comments.service';
import { ActivityService } from '@modules/activity/activity.service';
import { ActivityType } from '@modules/activity/activity.interface';
import { MaterialStatus } from '@modules/materials/material.interface';

export type AnalyticsCategory = ActivityType | 'ALL' | 'ACTIVE_USERS';

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
            rejectedMaterials,
            totalDownloads,
            totalComments,
            recentActivity,
            usersByRole,
            storageBytes,
            topContributors,
        ] = await Promise.all([
            this.usersService.countAll(),
            this.usersService.countOnlineSince(this.onlineSince()),
            this.usersService.countActiveSince(this.activeSince()),
            this.materialsService.countAll(),
            this.materialsService.countByStatus(MaterialStatus.PUBLISHED),
            this.materialsService.countByStatus(MaterialStatus.PENDING),
            this.materialsService.countByStatus(MaterialStatus.REJECTED),
            this.materialsService.sumDownloads(),
            this.commentsService.countAll(),
            this.activityService.findRecent(20),
            this.usersService.countByRole(),
            this.materialsService.sumStorageBytes(),
            this.usersService.topContributors(5),
        ]);

        const rejectionRate = totalMaterials > 0 ? rejectedMaterials / totalMaterials : 0;

        return {
            totalUsers,
            onlineUsersCount,
            activeUsers7d,
            totalMaterials,
            publishedMaterials,
            pendingMaterials,
            rejectedMaterials,
            rejectionRate,
            totalDownloads,
            totalComments,
            recentActivity,
            usersByRole,
            storageBytes,
            topContributors,
        };
    }

    async onlineUsers() {
        return this.usersService.findOnlineSince(this.onlineSince(), 50);
    }

    async analytics(days: number, category: AnalyticsCategory = 'ALL') {
        const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const [registrationsSeries, categorySeries, activityBreakdown, topMaterials] = await Promise.all([
            this.usersService.registrationsSeriesSince(sinceDate),
            this.categorySeriesSince(category, sinceDate),
            this.activityService.activityBreakdownSince(sinceDate),
            this.materialsService.topByDownloads(5),
        ]);

        return { registrationsSeries, categorySeries, category, activityBreakdown, topMaterials };
    }

    private categorySeriesSince(category: AnalyticsCategory, sinceDate: Date) {
        if (category === 'ALL') {
            return this.activityService.dailyTotalSeriesSince(sinceDate);
        }
        if (category === 'ACTIVE_USERS') {
            return this.activityService.distinctActiveUsersSeriesSince(sinceDate);
        }
        if (category === 'REGISTER') {
            return this.usersService.registrationsSeriesSince(sinceDate);
        }
        return this.activityService.dailySeriesSince(category, sinceDate);
    }

    async activityLog(page: number, limit: number, type?: ActivityType) {
        return this.activityService.findPaginated({ page, limit, type });
    }
}
