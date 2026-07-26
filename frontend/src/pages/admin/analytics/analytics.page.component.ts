import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminAnalytics, AdminStatsService, ActivityType } from '@widgets/admin';

interface SeriesBar {
  date: string;
  count: number;
  heightPercent: number;
}

interface BreakdownRow {
  type: ActivityType;
  count: number;
  percent: number;
  colorClass: string;
}

/** Fixed hue order for the small, closed set of activity types — never cycled or reassigned by rank. */
const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  REGISTER: 'bg-blue-500',
  LOGIN: 'bg-cyan-500',
  LOGOUT: 'bg-slate-400',
  PROFILE_UPDATE: 'bg-violet-500',
  MATERIAL_UPLOAD: 'bg-primary-600',
  MATERIAL_DOWNLOAD: 'bg-emerald-500',
  MATERIAL_COMMENT: 'bg-amber-500',
  MATERIAL_STATUS_CHANGE: 'bg-rose-500',
};

@Component({
  selector: 'app-analytics-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './analytics.page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPageComponent {
  private readonly adminStats = inject(AdminStatsService);

  isLoading = signal(true);
  days = signal(30);
  analytics = signal<AdminAnalytics | null>(null);

  registrationBars = computed<SeriesBar[]>(() => this.toBars(this.analytics()?.registrationsSeries ?? []));
  downloadBars = computed<SeriesBar[]>(() => this.toBars(this.analytics()?.downloadsSeries ?? []));

  breakdownRows = computed<BreakdownRow[]>(() => {
    const rows = this.analytics()?.activityBreakdown ?? [];
    const max = Math.max(...rows.map((r) => r.count), 1);
    return rows.map((row) => ({
      type: row.type,
      count: row.count,
      percent: Math.round((row.count / max) * 100),
      colorClass: ACTIVITY_TYPE_COLORS[row.type],
    }));
  });

  private toBars(series: { date: string; count: number }[]): SeriesBar[] {
    const max = Math.max(...series.map((s) => s.count), 1);
    return series.map((point) => ({
      date: point.date,
      count: point.count,
      heightPercent: Math.max(Math.round((point.count / max) * 100), point.count > 0 ? 6 : 0),
    }));
  }

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

  activityLabel(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase();
  }
}
