import { maxLength, minLength, required, schema } from '@angular/forms/signals';

export interface AutocompleteListForm {
    key: string;
    labelTranslationEn: string;
    labelTranslationRu: string;
    labelTranslationTj: string;
    description: string;
}

export const initialAutocompleteListForm: AutocompleteListForm = {
    key: '',
    labelTranslationEn: '',
    labelTranslationRu: '',
    labelTranslationTj: '',
    description: '',
};

export const autocompleteListFormSchema = schema<AutocompleteListForm>((path) => {
    required(path.key, { message: 'This is a required field.' });
    minLength(path.key, 2, { message: 'Minimum length: 2 characters.' });
    maxLength(path.key, 80, { message: 'Maximum length: 80 characters.' });

    required(path.labelTranslationEn, { message: 'This is a required field.' });
    maxLength(path.labelTranslationEn, 300, { message: 'Maximum length: 300 characters.' });

    required(path.labelTranslationRu, { message: 'This is a required field.' });
    maxLength(path.labelTranslationRu, 300, { message: 'Maximum length: 300 characters.' });

    required(path.labelTranslationTj, { message: 'This is a required field.' });
    maxLength(path.labelTranslationTj, 300, { message: 'Maximum length: 300 characters.' });

    maxLength(path.description, 500, { message: 'Maximum length: 500 characters.' });
});
