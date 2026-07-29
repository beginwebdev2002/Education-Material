import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  activityLabel,
  AdminAnalytics,
  AdminOverview,
  AdminStatsService,
  barWidth,
  DailySeriesPoint,
  ActivityTypeCount,
  formatBytes,
  OnlineUser,
} from '@widgets/admin';
import { PresenceSocketService } from '@entities/presence';
import { TranslatePipe } from '@shared/pipes';
import { TranslationService } from '@shared/services';

interface StatTile {
  label: string;
  value: string | number;
  icon: string;
  modifier: string;
}

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, TranslatePipe],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnDestroy {
  private readonly adminStats = inject(AdminStatsService);
  private readonly i18n = inject(TranslationService);
  private readonly presenceSocket = inject(PresenceSocketService);

  isLoading = signal(true);
  overview = signal<AdminOverview | null>(null);
  onlineUsers = signal<OnlineUser[]>([]);
  analytics = signal<AdminAnalytics | null>(null);

  private readonly liveOnlineCount = computed(() => this.presenceSocket.onlineCount() ?? this.overview()?.onlineUsersCount ?? 0);

  tiles = computed<StatTile[]>(() => {
    const data = this.overview();
    if (!data) {
      return [];
    }
    return [
      { label: this.i18n.translate('admin.overview.tiles.totalUsers'), value: data.totalUsers, icon: 'fa-users', modifier: 'users' },
      { label: this.i18n.translate('admin.overview.tiles.onlineNow'), value: this.liveOnlineCount(), icon: 'fa-circle-dot', modifier: 'online' },
      { label: this.i18n.translate('admin.overview.tiles.active7d'), value: data.activeUsers7d, icon: 'fa-user-clock', modifier: 'active' },
      { label: this.i18n.translate('admin.overview.tiles.publishedMaterials'), value: data.publishedMaterials, icon: 'fa-file-circle-check', modifier: 'published' },
      { label: this.i18n.translate('admin.overview.tiles.pendingMaterials'), value: data.pendingMaterials, icon: 'fa-file-circle-question', modifier: 'pending' },
      { label: this.i18n.translate('admin.overview.tiles.totalDownloads'), value: data.totalDownloads, icon: 'fa-download', modifier: 'downloads' },
      { label: this.i18n.translate('admin.overview.tiles.totalComments'), value: data.totalComments, icon: 'fa-comments', modifier: 'comments' },
      { label: this.i18n.translate('admin.overview.tiles.rejectionRate'), value: `${Math.round(data.rejectionRate * 100)}%`, icon: 'fa-file-circle-xmark', modifier: 'rejected' },
      { label: this.i18n.translate('admin.overview.tiles.storageUsed'), value: formatBytes(data.storageBytes), icon: 'fa-database', modifier: 'storage' },
    ];
  });

  registrationsMax = computed(() => this.maxCount(this.analytics()?.registrationsSeries));
  categoryMax = computed(() => this.maxCount(this.analytics()?.categorySeries));
  activityBreakdownMax = computed(() => this.maxCount(this.analytics()?.activityBreakdown));

  constructor() {
    this.adminStats.overview().subscribe({
      next: (data) => {
        this.overview.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
    this.adminStats.onlineUsers().subscribe((users) => this.onlineUsers.set(users));
    this.adminStats.analytics(30).subscribe((data) => this.analytics.set(data));
    this.presenceSocket.connect();
  }

  ngOnDestroy(): void {
    this.presenceSocket.disconnect();
  }

  activityLabel = activityLabel;
  barWidth = barWidth;

  private maxCount(series?: DailySeriesPoint[] | ActivityTypeCount[]): number {
    if (!series || series.length === 0) return 1;
    return series.reduce((max, point) => Math.max(max, point.count), 0) || 1;
  }
}
