import { schema, required, maxLength, email } from '@angular/forms/signals';

export interface ProfileForm {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    citizenship: string;
    bio: string;
    github: string;
    linkedIn: string;
    telegram: string;
    instagram: string;
    whatsapp: string;
}

export const initialProfileForm: ProfileForm = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    citizenship: '',
    bio: '',
    github: '',
    linkedIn: '',
    telegram: '',
    instagram: '',
    whatsapp: '',
};

export const profileFormSchema = schema<ProfileForm>((path) => {
    required(path.firstName, { message: 'This is a required field.' });
    maxLength(path.firstName, 50, { message: 'Maximum length: 50 characters.' });

    required(path.lastName, { message: 'This is a required field.' });
    maxLength(path.lastName, 50, { message: 'Maximum length: 50 characters.' });

    required(path.email, { message: 'This is a required field.' });
    email(path.email, { message: 'Invalid email format.' });

    maxLength(path.github, 100, { message: 'Maximum length: 100 characters.' });
    maxLength(path.linkedIn, 100, { message: 'Maximum length: 100 characters.' });
    maxLength(path.telegram, 100, { message: 'Maximum length: 100 characters.' });
    maxLength(path.instagram, 100, { message: 'Maximum length: 100 characters.' });
    maxLength(path.whatsapp, 100, { message: 'Maximum length: 100 characters.' });
});
