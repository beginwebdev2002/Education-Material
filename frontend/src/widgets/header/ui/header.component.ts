import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthModalContainerComponent, AuthService, AuthUiService } from '@features/auth';
import { MenuItem } from '@shared/models';
import { SettingsService } from '@shared/services';
<<<<<<< HEAD:frontend/src/widgets/header/header.component.ts
import { PermissionOnlyDirective, SessionStore } from '@shared/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AuthModalContainerComponent, PermissionOnlyDirective],
=======
import { HEADER_MENU_ITEMS } from '../config/header-menu';
import { HasRoleDirective } from '@shared/directives';
import { TranslatePipe } from '@shared/pipes';
import { LanguageSwitcherComponent } from '@widgets/language-switcher';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, AuthModalContainerComponent, HasRoleDirective, TranslatePipe, LanguageSwitcherComponent],
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:frontend/src/widgets/header/ui/header.component.ts
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

<<<<<<< HEAD:frontend/src/widgets/header/header.component.ts
  menuItems = signal<MenuItem[]>([
    { id: 1, label: 'Home', path: '/', exact: true },
    { id: 2, label: 'Materials', path: '/materials' },
    { id: 3, label: 'Dashboard', path: '/dashboard', requiresAuth: true },
  ]);

  visibleMenuItems = computed(() => {
    const authenticated = this.sessionStore.isAuthenticated();
    return this.menuItems().filter(item => !item.requiresAuth || authenticated);
  });

  profileMenuItems = computed<MenuItem[]>(() => [
    { id: 1, label: 'Profile', path: `/profile/${this.currentUser()?._id}` },
    { id: 2, label: 'Settings', path: '/settings' },
  ]);
  adminPanelText = signal("Admin Panel");

=======
  menuItems = signal<MenuItem[]>(HEADER_MENU_ITEMS);

  profileMenuItems = computed<MenuItem[]>(() => {
    return [
      { id: 1, label: 'header.profileMenu.profile', path: `/profile/${this.currentUser()?._id}` },
      { id: 2, label: 'header.profileMenu.settings', path: '/settings' },
    ]
  });

  constructor() {}

>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:frontend/src/widgets/header/ui/header.component.ts
  logout(): void {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.isMobileMenuHide.update(value => !value);
  }
}
