import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '@shared/services';

@Pipe({
    name: 'translate',
    pure: false,
})
export class TranslatePipe implements PipeTransform {
    private i18n = inject(TranslationService);

    transform(key: string, params?: Record<string, string | number>): string {
        return this.i18n.translate(key, params);
    }
}
