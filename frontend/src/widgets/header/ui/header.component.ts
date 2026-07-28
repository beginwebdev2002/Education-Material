import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, computed, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Collapse, Dropdown } from 'flowbite';
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
export class HeaderComponent implements AfterViewInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  sessionStore = inject(SessionStore);
  authUi: AuthUiService = inject(AuthUiService);
  settingsService: SettingsService = inject(SettingsService);

  currentUser = this.sessionStore.currentUser;
  isAdmin = this.sessionStore.isAdmin;

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

  // Optional because the trigger/panel only exist in the DOM once `@if
  // (sessionStore.isAuthenticated())` renders them — that can happen well
  // after this component's own ngAfterViewInit fires (e.g. signing in via
  // the modal without a full reload), so an `effect()` re-creates the
  // Dropdown reactively whenever these signals resolve, instead of a
  // one-shot lifecycle hook that would silently miss a later mount.
  private readonly userMenuTriggerRef = viewChild<ElementRef<HTMLButtonElement>>('userMenuTrigger');
  private readonly userMenuPanelRef = viewChild<ElementRef<HTMLDivElement>>('userMenuPanel');
  private userMenuDropdown?: Dropdown;

  private readonly mobileToggleRef = viewChild.required<ElementRef<HTMLButtonElement>>('mobileToggle');
  private readonly mobileMenuRef = viewChild.required<ElementRef<HTMLDivElement>>('mobileMenu');
  private mobileCollapse?: Collapse;

  constructor() {
    effect(() => {
      const trigger = this.userMenuTriggerRef();
      const panel = this.userMenuPanelRef();
      if (trigger && panel && !this.userMenuDropdown) {
        this.userMenuDropdown = new Dropdown(panel.nativeElement, trigger.nativeElement, { placement: 'bottom-end' });
      }
    });
  }

  ngAfterViewInit(): void {
    this.mobileCollapse = new Collapse(this.mobileMenuRef().nativeElement, this.mobileToggleRef().nativeElement);
  }

  ngOnDestroy(): void {
    this.userMenuDropdown?.destroy();
    this.mobileCollapse?.destroy();
  }

  logout(): void {
    this.userMenuDropdown?.hide();
    this.authService.logout();
  }

  closeMobileMenu(): void {
    this.mobileCollapse?.collapse();
  }
}
