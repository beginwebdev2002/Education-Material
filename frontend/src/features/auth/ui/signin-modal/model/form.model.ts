import { schema, required, minLength, maxLength, email } from '@angular/forms/signals';

export interface SigninForm {
    email: string;
    password: string;
}

export const initialSigninForm: SigninForm = {
    email: 'admin@edugen.tj',
    password: '3255443345',
};

export const signinFormSchema = schema<SigninForm>((path) => {
    required(path.email, { message: 'This is a required field.' });
    minLength(path.email, 3, { message: 'Minimum length: 3 characters.' });
    maxLength(path.email, 50, { message: 'Maximum length: 50 characters.' });
    email(path.email, { message: 'Invalid email format.' });

    required(path.password, { message: 'This is a required field.' });
    minLength(path.password, 3, { message: 'Minimum length: 3 characters.' });
    maxLength(path.password, 50, { message: 'Maximum length: 50 characters.' });
});
