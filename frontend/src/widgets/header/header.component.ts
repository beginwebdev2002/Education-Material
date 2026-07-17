import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserStorageService } from '@core/storage';
import { UserModel } from '@entities/user';
import { AuthModalContainerComponent, AuthService, AuthUiService } from '@features/auth';
import { MenuItem } from '@shared/models';
import { SettingsService } from '@shared/services';
import { HasRoleDirective } from '@shared/directives/has-role.directive';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageSwitcherComponent } from '@widgets/language-switcher';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AuthModalContainerComponent, HasRoleDirective, TranslatePipe, LanguageSwitcherComponent],
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
    { id: 1, label: 'header.nav.home', path: '/', exact: true },
    { id: 2, label: 'header.nav.materials', path: '/materials' },
    { id: 3, label: 'header.nav.dashboard', path: '/dashboard', requiresAuth: true },
    { id: 4, label: 'header.nav.docs', path: '/docs', requiresAuth: true, adminOnly: true },
  ]);

  profileMenuItems = computed<MenuItem[]>(() => {
    return [
      { id: 1, label: 'header.profileMenu.profile', path: `/profile/${this.currentUser()?._id}` },
      { id: 2, label: 'header.profileMenu.settings', path: '/settings' },
    ]
  });

  constructor() {}

  logout(): void {
    this.userStorage.clearUser();
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.isMobileMenuHide.update(value => !value);
  }
}