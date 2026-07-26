import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@features/auth';
import { AdminLayoutService, SettingsService } from '@shared/services';
import { SessionStore } from '@shared/auth';

@Component({
  selector: 'app-admin-header',
  styleUrls: ['./admin-header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeaderComponent {
  layoutService: AdminLayoutService = inject(AdminLayoutService);
  sessionStore = inject(SessionStore);
  authService: AuthService = inject(AuthService);
  settingsService: SettingsService = inject(SettingsService);

  currentUser = this.sessionStore.currentUser;
  searchQuery = signal('');

  logout() {
    this.authService.logout();
  }
}
