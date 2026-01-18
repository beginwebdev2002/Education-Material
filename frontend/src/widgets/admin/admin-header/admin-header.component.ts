import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStorageService } from '@core/storage';
import { UserService } from '@entities/user';
import { AuthService } from '@features/auth';
import { AdminLayoutService, SettingsService } from '@shared/services';

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
  userStorageService: UserStorageService = inject(UserStorageService);
  authService: AuthService = inject(AuthService);
  settingsService: SettingsService = inject(SettingsService);

  currentUser = this.userStorageService.loadUser();
  searchQuery = signal('');

  logout() {
    this.authService.logout();
    this.currentUser()?._id
  }
}