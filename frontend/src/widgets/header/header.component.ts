import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '@entities/user/data-access/user.service';
import { AuthModalContainerComponent } from '@features/auth/auth-modal-container.component';
import { AuthUiService } from '@features/auth/auth-ui.service';
import { AuthService } from '@features/auth/auth.service';
import { MenuItem } from '@shared/models/header.model';
import { SettingsService } from '@shared/services/settings.service';

// This tells TypeScript that a function named initFlowbite exists in the global scope.
// It is provided by the Flowbite script included in index.html.
declare const initFlowbite: () => void;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AuthModalContainerComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  authUi: AuthUiService = inject(AuthUiService);
  settingsService: SettingsService = inject(SettingsService);
  isMenuOpen = signal(false);

  currentUser = this.userService.currentUser;
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isMobileMenuHide = signal(true);

  menuItems = signal<MenuItem[]>([
    { id: 1, label: 'Home', path: '/', exact: true },
    { id: 2, label: 'Materials', path: '/materials' },
    { id: 3, label: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { id: 4, label: 'Docs', path: '/docs', requiresAuth: true, adminOnly: true },
  ]);

  profileMenuItems = computed<MenuItem[]>(() => {
    return [
      { id: 1, label: 'Profile', path: `/profile/${this.userService.currentUser()?._id}` },
      { id: 2, label: 'Settings', path: '/settings' },
    ]
  });
  adminPanelText = signal("Admin Panel")

  logout(): void {
    this.userService.clearUser();
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.isMobileMenuHide.update(value => !value);
  }
}