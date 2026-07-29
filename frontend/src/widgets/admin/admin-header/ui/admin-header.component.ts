import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dropdown } from 'flowbite';
import { AuthService } from '@features/auth';
import { AdminLayoutService, SettingsService } from '@shared/services';
import { SessionStore } from '@shared/auth';
import { TranslatePipe } from '@shared/pipes';
import { LanguageSwitcherComponent } from '@widgets/language-switcher';

@Component({
  selector: 'app-admin-header',
  styleUrls: ['./admin-header.component.scss'],
  imports: [CommonModule, RouterLink, LanguageSwitcherComponent, TranslatePipe],
  templateUrl: './admin-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeaderComponent implements OnDestroy {
  layoutService: AdminLayoutService = inject(AdminLayoutService);
  sessionStore = inject(SessionStore);
  authService: AuthService = inject(AuthService);
  settingsService: SettingsService = inject(SettingsService);

  currentUser = this.sessionStore.currentUser;
  searchQuery = signal('');

  // See header.component.ts for why this is an effect() rather than
  // ngAfterViewInit() — the trigger/panel are gated by `@if (currentUser())`.
  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panelRef = viewChild<ElementRef<HTMLDivElement>>('panel');
  private dropdown?: Dropdown;

  constructor() {
    effect(() => {
      const trigger = this.triggerRef();
      const panel = this.panelRef();
      if (trigger && panel && !this.dropdown) {
        this.dropdown = new Dropdown(panel.nativeElement, trigger.nativeElement, { placement: 'bottom-end' });
      }
    });
  }

  ngOnDestroy(): void {
    this.dropdown?.destroy();
  }

  logout() {
    this.authService.logout();
  }
}
