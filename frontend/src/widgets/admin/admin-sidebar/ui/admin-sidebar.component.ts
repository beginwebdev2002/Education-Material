import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminLayoutService } from '@shared/services';
import { ADMIN_NAV_LINKS } from '../config/admin-nav-links';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent {
  layoutService = inject(AdminLayoutService);

  navLinks = ADMIN_NAV_LINKS;
}