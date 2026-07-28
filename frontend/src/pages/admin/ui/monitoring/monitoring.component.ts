import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  activityLabel,
  ActivityEntry,
  ActivityTypeCount,
  AdminAnalytics,
  AdminOverview,
  AdminStatsService,
  barWidth,
  DailySeriesPoint,
  OnlineUser,
} from '@widgets/admin';
import { TranslatePipe } from '@shared/pipes';

@Component({
  selector: 'app-monitoring-page',
  imports: [CommonModule, DatePipe, RouterLink, TranslatePipe],
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringComponent {
  private readonly adminStats = inject(AdminStatsService);

  isLoading = signal(true);
  overview = signal<AdminOverview | null>(null);
  onlineUsers = signal<OnlineUser[]>([]);
  analytics = signal<AdminAnalytics | null>(null);
  recentActivity = signal<ActivityEntry[]>([]);

  registrationsMax = computed(() => this.maxCount(this.analytics()?.registrationsSeries));
  downloadsMax = computed(() => this.maxCount(this.analytics()?.downloadsSeries));
  activityBreakdownMax = computed(() => {
    const breakdown = this.analytics()?.activityBreakdown ?? [];
    return breakdown.reduce((max, entry) => Math.max(max, entry.count), 0) || 1;
  });

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
    this.adminStats.activityLog(1, 15).subscribe((response) => this.recentActivity.set(response.items));
  }

  activityLabel = activityLabel;
  barWidth = barWidth;

  private maxCount(series?: DailySeriesPoint[] | ActivityTypeCount[]): number {
    if (!series || series.length === 0) return 1;
    return series.reduce((max, point) => Math.max(max, point.count), 0) || 1;
  }
}
