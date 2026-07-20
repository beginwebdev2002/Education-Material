import { schema, required, minLength, maxLength, email } from '@angular/forms/signals';

export interface SignupForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const initialSignupForm: SignupForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
};

export const signupFormSchema = schema<SignupForm>((path) => {
    required(path.firstName, { message: 'This is a required field.' });
    minLength(path.firstName, 3, { message: 'Minimum length: 3 characters.' });
    maxLength(path.firstName, 50, { message: 'Maximum length: 50 characters.' });

    required(path.lastName, { message: 'This is a required field.' });
    minLength(path.lastName, 3, { message: 'Minimum length: 3 characters.' });
    maxLength(path.lastName, 50, { message: 'Maximum length: 50 characters.' });

    required(path.email, { message: 'This is a required field.' });
    minLength(path.email, 3, { message: 'Minimum length: 3 characters.' });
    maxLength(path.email, 50, { message: 'Maximum length: 50 characters.' });
    email(path.email, { message: 'Invalid email format.' });

    required(path.password, { message: 'This is a required field.' });
    minLength(path.password, 3, { message: 'Minimum length: 3 characters.' });
    maxLength(path.password, 50, { message: 'Maximum length: 50 characters.' });
});
