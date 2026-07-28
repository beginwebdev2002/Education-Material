import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { activityLabel, AdminOverview, AdminStatsService, OnlineUser } from '@widgets/admin';

interface StatTile {
  label: string;
  value: number;
  icon: string;
  modifier: string;
}

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
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
      { label: $localize`Total Users`, value: data.totalUsers, icon: 'fa-users', modifier: 'users' },
      { label: $localize`Online Now`, value: data.onlineUsersCount, icon: 'fa-circle-dot', modifier: 'online' },
      { label: $localize`Active (7d)`, value: data.activeUsers7d, icon: 'fa-user-clock', modifier: 'active' },
      { label: $localize`Published Materials`, value: data.publishedMaterials, icon: 'fa-file-circle-check', modifier: 'published' },
      { label: $localize`Pending Materials`, value: data.pendingMaterials, icon: 'fa-file-circle-question', modifier: 'pending' },
      { label: $localize`Total Downloads`, value: data.totalDownloads, icon: 'fa-download', modifier: 'downloads' },
      { label: $localize`Total Comments`, value: data.totalComments, icon: 'fa-comments', modifier: 'comments' },
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

  activityLabel = activityLabel;
}
