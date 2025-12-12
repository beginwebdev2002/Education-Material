import { Component, ChangeDetectionStrategy, inject, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '@features/auth/data-access/auth-state.service';
import { AuthUiService } from '@features/auth/auth-ui.service';
import { AuthModalContainerComponent } from '@features/auth/auth-modal-container.component';
import { SettingsService } from '@shared/services/settings.service';
import { MenuItem } from '@shared/models/header.model';
import { MockAuthService } from '@entities/auth/auth.service';

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
  // FIX: Added explicit types to resolve 'unknown' type errors on injected services.
  authService: MockAuthService = inject(MockAuthService);
  authState: AuthStateService = inject(AuthStateService);
  authUi: AuthUiService = inject(AuthUiService);
  settingsService: SettingsService = inject(SettingsService);

  currentUser = this.authState.currentUser;
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isMobileMenuHide = signal(true);
  menuItems = signal<MenuItem[]>([
    { id: 1, label: 'Home', path: '/', exact: true },
    { id: 2, label: 'Materials', path: '/materials' },
    { id: 3, label: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { id: 4, label: 'Docs', path: '/docs', requiresAuth: true, adminOnly: true },
  ]);
  profileMenuItems = signal<MenuItem[]>([
    { id: 1, label: 'Profile', path: `/profile/${this.authState.currentUser()?._id}` },
    { id: 2, label: 'Settings', path: '/settings' },
  ]);
  adminPanelText = signal("Admin Panel")

  constructor() {
    effect(() => {
      this.currentUser(); // Establish dependency on the signal
      setTimeout(() => {
        if (typeof initFlowbite === 'function') {
          initFlowbite();
        }
      }, 0);
    });
  }

  logout(): void {
    this.authState.logout();
  }

  toggleMobileMenu() {
    this.isMobileMenuHide.update(value => !value);
  }
}