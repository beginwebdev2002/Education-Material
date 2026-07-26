import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminOverview, AdminStatsService, OnlineUser } from '@widgets/admin';

interface StatTile {
  label: string;
  value: number;
  icon: string;
  accent: string;
}

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './overview.page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPageComponent {
  private readonly adminStats = inject(AdminStatsService);

  isLoading = signal(true);
  overview = signal<AdminOverview | null>(null);
  onlineUsers = signal<OnlineUser[]>([]);

  tiles = computed<StatTile[]>(() => {
    const data = this.overview();
    if (!data) {
      return [];
    }
    return [
      { label: $localize`Total Users`, value: data.totalUsers, icon: 'fa-users', accent: 'text-blue-500' },
      { label: $localize`Online Now`, value: data.onlineUsersCount, icon: 'fa-circle-dot', accent: 'text-green-500' },
      { label: $localize`Active (7d)`, value: data.activeUsers7d, icon: 'fa-user-clock', accent: 'text-indigo-500' },
      { label: $localize`Published Materials`, value: data.publishedMaterials, icon: 'fa-file-circle-check', accent: 'text-primary-500' },
      { label: $localize`Pending Materials`, value: data.pendingMaterials, icon: 'fa-file-circle-question', accent: 'text-yellow-500' },
      { label: $localize`Total Downloads`, value: data.totalDownloads, icon: 'fa-download', accent: 'text-purple-500' },
      { label: $localize`Total Comments`, value: data.totalComments, icon: 'fa-comments', accent: 'text-pink-500' },
    ];
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
  }

  activityLabel(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase();
  }
}
