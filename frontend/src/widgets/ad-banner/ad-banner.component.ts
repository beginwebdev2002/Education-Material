import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisingService } from '../../shared/services/advertising.service';

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdBannerComponent {
  advertisingService = inject(AdvertisingService);
  activeAd = this.advertisingService.activeAd;
  isVisible = signal(true);

  dismiss(): void {
    this.isVisible.set(false);
  }
}
