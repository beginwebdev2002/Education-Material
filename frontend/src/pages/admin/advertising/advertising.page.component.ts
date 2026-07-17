import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdvertisingService, TranslationService } from '@shared/services';
import { Ad, AdType } from '@shared/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { requiredValidator } from '@shared/validation';

@Component({
  selector: 'app-advertising-page',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './advertising.page.component.html',
  styleUrls: ['./advertising.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvertisingPageComponent {
  advertisingService = inject(AdvertisingService);
  private i18n = inject(TranslationService);

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [requiredValidator()] }),
    type: new FormControl<AdType>('text', { nonNullable: true }),
    content: new FormControl('', { nonNullable: true, validators: [requiredValidator()] }),
    isActive: new FormControl(false, { nonNullable: true }),
  });

  adTypes: AdType[] = [
    `text`,
    'image',
    'video',
    'audio'
  ];
  ads = this.advertisingService.ads;

  addAd(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.advertisingService.addAd(this.form.getRawValue());
    this.form.reset({ title: '', content: '', type: 'text', isActive: false });
  }

  onTypeChange(): void {
    this.form.controls.content.setValue('');
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
