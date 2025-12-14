import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '@entities/user/data-access/user.service';
import { AuthService } from '@features/auth/auth.service';
import { AdminLayoutService } from '@shared/services/admin-layout.service';
import { SettingsService } from '@shared/services/settings.service';

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
  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);
  settingsService: SettingsService = inject(SettingsService);

  currentUser = this.userService.currentUser;
  searchQuery = signal('');

  logout() {
    this.authService.logout();
  }
}