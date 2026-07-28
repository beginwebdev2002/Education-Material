import { maxLength, required, schema } from '@angular/forms/signals';

export interface AutocompleteItemForm {
    translationEn: string;
    translationRu: string;
    translationTj: string;
}

export const initialAutocompleteItemForm: AutocompleteItemForm = {
    translationEn: '',
    translationRu: '',
    translationTj: '',
};

export const autocompleteItemFormSchema = schema<AutocompleteItemForm>((path) => {
    required(path.translationEn, { message: 'This is a required field.' });
    maxLength(path.translationEn, 300, { message: 'Maximum length: 300 characters.' });

    required(path.translationRu, { message: 'This is a required field.' });
    maxLength(path.translationRu, 300, { message: 'Maximum length: 300 characters.' });

    required(path.translationTj, { message: 'This is a required field.' });
    maxLength(path.translationTj, 300, { message: 'Maximum length: 300 characters.' });
});
