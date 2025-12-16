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
    { path: '/admin/statistics', label: 'Dashboard Overview', icon: 'fa-solid fa-chart-pie' },
    { path: '/admin/users', label: 'User Management', icon: 'fa-solid fa-users-cog' },
    { path: '/admin/materials', label: 'Material Control', icon: 'fa-solid fa-file-invoice' },
    { path: '/admin/analytics', label: 'Analytics & Reports', icon: 'fa-solid fa-chart-line' },
    { path: '/admin/ai-management', label: 'AI Core Management', icon: 'fa-solid fa-brain' },
    { path: '/admin/system-settings', label: 'System Settings', icon: 'fa-solid fa-cogs' },
    { path: '/admin/advertising', label: 'Advertising', icon: 'fa-solid fa-bullhorn' },
  ];
}