import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminLayoutService } from '../../../shared/services/admin-layout.service';
import { SettingsService } from '../../../shared/services/settings.service';
import { MockAuthService } from '../../../entities/auth/auth.service';

@Component({
  selector: 'app-admin-header',
  styleUrls: ['./admin-header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeaderComponent {
  // FIX: Added explicit types to resolve 'unknown' type errors on injected services.
  layoutService: AdminLayoutService = inject(AdminLayoutService);
  authService: MockAuthService = inject(MockAuthService);
  settingsService: SettingsService = inject(SettingsService);

  currentUser = this.authService.currentUser;
  searchQuery = signal('');

  logout() {
    this.authService.logout();
  }
}