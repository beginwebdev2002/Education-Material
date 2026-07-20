import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, FormField, submit } from '@angular/forms/signals';
import { AdvertisingService, TranslationService } from '@shared/services';
import { Ad, AdType } from '@shared/models';
import { TranslatePipe } from '@shared/pipes';
import { initialAdvertisingForm, advertisingFormSchema } from './model/form.model';

@Component({
  selector: 'app-advertising-page',
  imports: [CommonModule, FormField, TranslatePipe],
  templateUrl: './advertising.page.component.html',
  styleUrls: ['./advertising.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvertisingPageComponent {
  advertisingService = inject(AdvertisingService);
  private i18n = inject(TranslationService);

  model = signal(initialAdvertisingForm);
  form = form(this.model, advertisingFormSchema);

  adTypes: AdType[] = [
    `text`,
    'image',
    'video',
    'audio'
  ];
  ads = this.advertisingService.ads;

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      this.advertisingService.addAd(this.model());
      this.model.set({ ...initialAdvertisingForm });
      return undefined;
    });
  }

  onTypeChange(): void {
    this.model.update(m => ({ ...m, content: '' }));
  }

  toggleAdStatus(ad: Ad): void {
    const updatedAd = { ...ad, isActive: !ad.isActive };
    this.advertisingService.updateAd(updatedAd);
  }

  deleteAd(adId: string): void {
    if (confirm(this.i18n.translate('admin.advertising.confirmDelete'))) {
      this.advertisingService.deleteAd(adId);
    }
  }
}
