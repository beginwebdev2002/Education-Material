import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserStorageService } from '@core/storage';
import { UserModel } from '@entities/user';
import { AuthModalContainerComponent, AuthService, AuthUiService } from '@features/auth';
import { MenuItem } from '@shared/models';
import { SettingsService } from '@shared/services';

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
  userStorage: UserStorageService = inject(UserStorageService);
  authUi: AuthUiService = inject(AuthUiService);
  settingsService: SettingsService = inject(SettingsService);
  isMenuOpen = signal(false);

  currentUser = this.userStorage.loadUser();
  userData$ = this.userStorage.userData$;
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  isMobileMenuHide = signal(true);

  menuItems = signal<MenuItem[]>([
    { id: 1, label: 'Home', path: '/', exact: true },
    { id: 2, label: 'Materials', path: '/materials' },
    { id: 3, label: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { id: 4, label: 'Docs', path: '/docs', requiresAuth: true, adminOnly: true },
  ]);

  profileMenuItems = computed<MenuItem[]>(() => {
    return [
      { id: 1, label: 'Profile', path: `/profile/${this.currentUser()?._id}` },
      { id: 2, label: 'Settings', path: '/settings' },
    ]
  });
  adminPanelText = signal("Admin Panel");

  constructor() {
    effect(() => {

    })

    this.userData$.subscribe((next) => {
      this.currentUser = signal(next);
    })
  }

  logout(): void {
    this.userStorage.clearUser();
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.isMobileMenuHide.update(value => !value);
  }
}