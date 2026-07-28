import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '@shared/services';
import { Translations } from '@shared/models';

type TranslationLabelInput =
    | { translations: Translations }
    | { labelTranslations: Translations }
    | Translations
    | null
    | undefined;

@Pipe({
    name: 'translationLabel',
    pure: false,
})
export class TranslationLabelPipe implements PipeTransform {
    private readonly i18n = inject(TranslationService);

    transform(value: TranslationLabelInput): string {
        if (!value) {
            return '';
        }
        const translations =
            'translations' in value ? value.translations : 'labelTranslations' in value ? value.labelTranslations : value;
        return translations[this.i18n.locale()] || translations.en || '';
    }
}
