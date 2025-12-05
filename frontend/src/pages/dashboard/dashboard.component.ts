import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { GenerationFormComponent } from '../../features/generation-form/generation-form.component';
import { GenerationHistoryComponent } from '../../features/generation-history/generation-history.component';
import { GenerationHistoryItem } from '../../shared/models/generation.model';
import { IllustrationComponent } from '../../shared/ui/illustration/illustration.component';
import { AdBannerComponent } from '../../widgets/ad-banner/ad-banner.component';

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