import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivityEntry, ActivityType, AdminStatsService } from '@widgets/admin';

const ACTIVITY_TYPES: ActivityType[] = [
  'REGISTER', 'LOGIN', 'LOGOUT', 'PROFILE_UPDATE',
  'MATERIAL_UPLOAD', 'MATERIAL_DOWNLOAD', 'MATERIAL_COMMENT', 'MATERIAL_STATUS_CHANGE',
];

@Component({
  selector: 'app-activity-log-page',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './activity-log.page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogPageComponent {
  private readonly adminStats = inject(AdminStatsService);

  activityTypes = ACTIVITY_TYPES;

  isLoading = signal(true);
  entries = signal<ActivityEntry[]>([]);
  total = signal(0);
  page = signal(1);
  limit = 25;
  typeFilter = signal<ActivityType | ''>('');

  hasMore = computed(() => this.entries().length < this.total());

  constructor() {
    this.load(1, true);
  }

  onFilterChange(type: ActivityType | ''): void {
    this.typeFilter.set(type);
    this.load(1, true);
  }

  loadMore(): void {
    if (!this.hasMore()) {
      return;
    }
    this.load(this.page() + 1, false);
  }

  private load(page: number, replace: boolean): void {
    this.isLoading.set(replace);
    this.adminStats.activityLog(page, this.limit, this.typeFilter() || undefined).subscribe({
      next: (response) => {
        this.entries.update((current) => (replace ? response.items : [...current, ...response.items]));
        this.total.set(response.total);
        this.page.set(response.page);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  activityLabel(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase();
  }
}
