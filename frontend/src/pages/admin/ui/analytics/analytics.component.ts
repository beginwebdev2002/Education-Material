import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ACTIVITY_TYPE_MODIFIERS, activityLabel, AdminAnalytics, AdminStatsService, ActivityType, AnalyticsCategory, toBars } from '@widgets/admin';
import { TranslatePipe } from '@shared/pipes';

interface BreakdownRow {
  type: ActivityType;
  count: number;
  percent: number;
  modifier: string;
}

interface CategoryOption {
  value: AnalyticsCategory;
  labelKey: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'ALL', labelKey: 'admin.analytics.categoryAll' },
  { value: 'MATERIAL_DOWNLOAD', labelKey: 'admin.analytics.categoryDownloads' },
  { value: 'LOGIN', labelKey: 'admin.analytics.categoryLogins' },
  { value: 'REGISTER', labelKey: 'admin.analytics.categoryRegistrations' },
  { value: 'MATERIAL_DELETE', labelKey: 'admin.analytics.categoryMaterialDeletions' },
  { value: 'MATERIAL_COMMENT', labelKey: 'admin.analytics.categoryComments' },
  { value: 'ACTIVE_USERS', labelKey: 'admin.analytics.categoryActiveUsers' },
];

@Component({
  selector: 'app-analytics-page',
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
  private readonly adminStats = inject(AdminStatsService);

  isLoading = signal(true);
  days = signal(30);
  category = signal<AnalyticsCategory>('ALL');
  analytics = signal<AdminAnalytics | null>(null);

  categoryOptions = CATEGORY_OPTIONS;
  selectedCategoryLabelKey = computed(() => CATEGORY_OPTIONS.find((o) => o.value === this.category())?.labelKey ?? 'admin.analytics.categoryAll');

  registrationBars = computed(() => toBars(this.analytics()?.registrationsSeries ?? []));
  categoryBars = computed(() => toBars(this.analytics()?.categorySeries ?? []));

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

  changeCategory(category: AnalyticsCategory): void {
    this.category.set(category);
    this.load();
  }

  constructor() {
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.adminStats.analytics(this.days(), this.category()).subscribe({
      next: (data) => {
        this.analytics.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  activityLabel = activityLabel;
}
