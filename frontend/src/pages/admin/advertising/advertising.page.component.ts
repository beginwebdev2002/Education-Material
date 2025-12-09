import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdvertisingService } from '@shared/services/advertising.service';
import { Ad, AdType } from '@shared/models/ad.model';

@Component({
  selector: 'app-advertising-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advertising.page.component.html',
  styleUrls: ['./advertising.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvertisingPageComponent {
  advertisingService = inject(AdvertisingService);

  newAd = signal<{ title: string; content: string; type: AdType; isActive: boolean }>({
    title: '',
    content: '',
    type: 'text',
    isActive: false,
  });

  adTypes: AdType[] = [
    `text`,
    'image',
    'video',
    'audio'
  ];
  ads = this.advertisingService.ads;

  addAd(): void {
    if (this.newAd().title && this.newAd().content) {
      this.advertisingService.addAd(this.newAd());
      this.newAd.set({ title: '', content: '', type: 'text', isActive: false });
    }
  }

  onTypeChange(newType: AdType): void {
    this.newAd.update(ad => ({ ...ad, type: newType, content: '' }));
  }

  toggleAdStatus(ad: Ad): void {
    const updatedAd = { ...ad, isActive: !ad.isActive };
    this.advertisingService.updateAd(updatedAd);
  }

  deleteAd(adId: string): void {
    if (confirm($localize`Are you sure you want to delete this ad?`)) {
      this.advertisingService.deleteAd(adId);
    }
  }
}
