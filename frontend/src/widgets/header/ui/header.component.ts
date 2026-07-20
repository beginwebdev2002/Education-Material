import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserStorageService } from '@core/storage';
import { UserModel } from '@entities/user';
import { AuthModalContainerComponent, AuthService, AuthUiService } from '@features/auth';
import { MenuItem } from '@shared/models';
import { SettingsService } from '@shared/services';
import { HEADER_MENU_ITEMS } from '../config/header-menu';
import { HasRoleDirective } from '@shared/directives';
import { TranslatePipe } from '@shared/pipes';
import { LanguageSwitcherComponent } from '@widgets/language-switcher';

@Component({
  selector: 'app-header',
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

  menuItems = signal<MenuItem[]>(HEADER_MENU_ITEMS);

  profileMenuItems = computed<MenuItem[]>(() => {
    return [
      { id: 1, label: 'header.profileMenu.profile', path: `/profile/${this.currentUser()?._id}` },
      { id: 2, label: 'header.profileMenu.settings', path: '/settings' },
    ]
  });

  constructor() {}

  logout(): void {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.isMobileMenuHide.update(value => !value);
  }
}