import { Component, ChangeDetectionStrategy, effect, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { HeaderComponent } from '../widgets/header/header.component';
import { SettingsService } from '../shared/services/settings.service';
import { LoadingService } from '../shared/services/loading.service';
import { ProgressBarComponent } from '../shared/ui/progress-bar/progress-bar.component';
import { FooterComponent } from '../widgets/footer/footer.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ProgressBarComponent, FooterComponent],
})
export class AppComponent {
  private settingsService: SettingsService = inject(SettingsService);
  private router: Router = inject(Router);
  loadingService: LoadingService = inject(LoadingService);
  showMainLayout = signal(true);

  constructor() {
    effect(() => {
      const theme = this.settingsService.theme();
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed()
    )
      // FIX: Explicitly typed the `event` parameter as `NavigationEnd` to correct a type inference issue where `event` was being treated as `unknown`.
      .subscribe((event: NavigationEnd) => {
        this.showMainLayout.set(!event.urlAfterRedirects.startsWith('/admin'));
      });

    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.isLoading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Add a small delay to prevent flickering on fast loads
        setTimeout(() => this.loadingService.isLoading.set(false), 200);
      }
    });
  }
}
