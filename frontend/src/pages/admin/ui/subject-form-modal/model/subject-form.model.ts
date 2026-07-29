import { maxLength, required, schema } from '@angular/forms/signals';

export interface SubjectForm {
    translationEn: string;
    translationRu: string;
    translationTj: string;
}

export const initialSubjectForm: SubjectForm = {
    translationEn: '',
    translationRu: '',
    translationTj: '',
};

export const subjectFormSchema = schema<SubjectForm>((path) => {
    required(path.translationEn, { message: 'This is a required field.' });
    maxLength(path.translationEn, 300, { message: 'Maximum length: 300 characters.' });

    required(path.translationRu, { message: 'This is a required field.' });
    maxLength(path.translationRu, 300, { message: 'Maximum length: 300 characters.' });

    required(path.translationTj, { message: 'This is a required field.' });
    maxLength(path.translationTj, 300, { message: 'Maximum length: 300 characters.' });
});
