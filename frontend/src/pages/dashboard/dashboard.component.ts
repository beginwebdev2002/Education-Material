import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { GenerationFormComponent } from '@features/generation-form';
import { GenerationHistoryComponent } from '@features/generation-history';
import { GenerationHistoryItem } from '@shared/models';
import { IllustrationComponent } from '@shared/ui';
import { AdBannerComponent } from '@widgets/ad-banner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GenerationFormComponent, GenerationHistoryComponent, IllustrationComponent, AdBannerComponent],
})
export class DashboardComponent {
  requestToLoad = signal<GenerationHistoryItem | null>(null);

  loadRequestInForm(request: GenerationHistoryItem): void {
    // Setting this signal will trigger the effect in the form component
    this.requestToLoad.set(request);
    // Scroll to the top of the page to make the form visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}