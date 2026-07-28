import { maxLength, minLength, required, schema } from '@angular/forms/signals';

export interface UploadForm {
    title: string;
    description: string;
}

export const initialUploadForm: UploadForm = { title: '', description: '' };

export const uploadFormSchema = schema<UploadForm>((path) => {
    required(path.title, { message: 'This is a required field.' });
    minLength(path.title, 3, { message: 'Minimum length: 3 characters.' });
    maxLength(path.title, 150, { message: 'Maximum length: 150 characters.' });

    required(path.description, { message: 'This is a required field.' });
    minLength(path.description, 10, { message: 'Minimum length: 10 characters.' });
    maxLength(path.description, 2000, { message: 'Maximum length: 2000 characters.' });
});
