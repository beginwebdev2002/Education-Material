import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocalizationService } from '@core/services/localization.service';

@Pipe({
   name: 'translate',
   standalone: true,
   pure: false // Не pure, чтобы реагировать на изменения языка
})
export class TranslatePipe implements PipeTransform {
   private localizationService = inject(LocalizationService);

   transform(key: string, params?: Record<string, string | number>): string {
      if (params) {
         return this.localizationService.translateWithParams(key, params);
      }
      return this.localizationService.translate(key);
   }
}
