import { maxLength, required, schema } from '@angular/forms/signals';

export interface InstitutionForm {
    translationEn: string;
    translationRu: string;
    translationTj: string;
}

export const initialInstitutionForm: InstitutionForm = {
    translationEn: '',
    translationRu: '',
    translationTj: '',
};

export const institutionFormSchema = schema<InstitutionForm>((path) => {
    required(path.translationEn, { message: 'This is a required field.' });
    maxLength(path.translationEn, 300, { message: 'Maximum length: 300 characters.' });

    required(path.translationRu, { message: 'This is a required field.' });
    maxLength(path.translationRu, 300, { message: 'Maximum length: 300 characters.' });

    required(path.translationTj, { message: 'This is a required field.' });
    maxLength(path.translationTj, 300, { message: 'Maximum length: 300 characters.' });
});
