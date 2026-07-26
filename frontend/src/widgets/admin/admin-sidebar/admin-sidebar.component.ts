import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminLayoutService } from '@shared/services';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent {
  layoutService = inject(AdminLayoutService);

  navLinks = [
    { path: '/admin/overview', label: 'Overview', icon: 'fa-solid fa-chart-pie' },
    { path: '/admin/users', label: 'User Management', icon: 'fa-solid fa-users-cog' },
    { path: '/admin/materials', label: 'Material Control', icon: 'fa-solid fa-file-invoice' },
    { path: '/admin/comments', label: 'Comment Moderation', icon: 'fa-solid fa-comments' },
    { path: '/admin/analytics', label: 'Analytics & Reports', icon: 'fa-solid fa-chart-line' },
    { path: '/admin/activity', label: 'Activity Log', icon: 'fa-solid fa-list-check' },
  ];
}