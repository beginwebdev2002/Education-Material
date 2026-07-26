import { schema, required, maxLength, email } from '@angular/forms/signals';

export interface ProfileForm {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    linkedinLink: string;
    telegramLink: string;
    instagramLink: string;
    whatsappLink: string;
}

export const initialProfileForm: ProfileForm = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    linkedinLink: '',
    telegramLink: '',
    instagramLink: '',
    whatsappLink: '',
};

export const profileFormSchema = schema<ProfileForm>((path) => {
    required(path.firstName, { message: 'This is a required field.' });
    maxLength(path.firstName, 50, { message: 'Maximum length: 50 characters.' });

    required(path.lastName, { message: 'This is a required field.' });
    maxLength(path.lastName, 50, { message: 'Maximum length: 50 characters.' });

    required(path.email, { message: 'This is a required field.' });
    email(path.email, { message: 'Invalid email format.' });

    maxLength(path.linkedinLink, 100, { message: 'Maximum length: 100 characters.' });
    maxLength(path.telegramLink, 100, { message: 'Maximum length: 100 characters.' });
    maxLength(path.instagramLink, 100, { message: 'Maximum length: 100 characters.' });
    maxLength(path.whatsappLink, 100, { message: 'Maximum length: 100 characters.' });
});
