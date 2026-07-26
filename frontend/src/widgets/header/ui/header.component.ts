import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthModalContainerComponent, AuthService, AuthUiService } from '@features/auth';
import { MenuItem } from '@shared/models';
import { SettingsService } from '@shared/services';
import { PermissionOnlyDirective, SessionStore } from '@shared/auth';
import { HEADER_MENU_ITEMS } from '../config/header-menu';
import { TranslatePipe } from '@shared/pipes';
import { LanguageSwitcherComponent } from '@widgets/language-switcher';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, AuthModalContainerComponent, PermissionOnlyDirective, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService: AuthService = inject(AuthService);
  sessionStore = inject(SessionStore);
  authUi: AuthUiService = inject(AuthUiService);
  settingsService: SettingsService = inject(SettingsService);
  isMenuOpen = signal(false);

  currentUser = this.sessionStore.currentUser;
  isAdmin = this.sessionStore.isAdmin;
  isMobileMenuHide = signal(true);

  menuItems = signal<MenuItem[]>(HEADER_MENU_ITEMS);

  visibleMenuItems = computed(() => {
    const authenticated = this.sessionStore.isAuthenticated();
    return this.menuItems().filter(item => !item.requiresAuth || authenticated);
  });

  profileMenuItems = computed<MenuItem[]>(() => {
    return [
      { id: 1, label: 'header.profileMenu.profile', path: `/profile/${this.currentUser()?._id}` },
      { id: 2, label: 'header.profileMenu.settings', path: '/settings' },
    ]
  });

  logout(): void {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.isMobileMenuHide.update(value => !value);
  }
}
