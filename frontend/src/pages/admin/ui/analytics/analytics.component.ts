import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ACTIVITY_TYPE_MODIFIERS, activityLabel, AdminAnalytics, AdminStatsService, ActivityType, toBars } from '@widgets/admin';

interface BreakdownRow {
  type: ActivityType;
  count: number;
  percent: number;
  modifier: string;
}

@Component({
  selector: 'app-analytics-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
  private readonly adminStats = inject(AdminStatsService);

  isLoading = signal(true);
  days = signal(30);
  analytics = signal<AdminAnalytics | null>(null);

  registrationBars = computed(() => toBars(this.analytics()?.registrationsSeries ?? []));
  downloadBars = computed(() => toBars(this.analytics()?.downloadsSeries ?? []));

  breakdownRows = computed<BreakdownRow[]>(() => {
    const rows = this.analytics()?.activityBreakdown ?? [];
    const max = Math.max(...rows.map((r) => r.count), 1);
    return rows.map((row) => ({
      type: row.type,
      count: row.count,
      percent: Math.round((row.count / max) * 100),
      modifier: ACTIVITY_TYPE_MODIFIERS[row.type],
    }));
  });

  changeRange(days: number): void {
    this.days.set(days);
    this.load();
  }

  constructor() {
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.adminStats.analytics(this.days()).subscribe({
      next: (data) => {
        this.analytics.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  activityLabel = activityLabel;
}
