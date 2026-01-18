import { signal } from "@angular/core";
import { email, FieldTree, form, required } from "@angular/forms/signals";


export interface SigninFormState {
    email: string;
    password: string;
}
export interface SignupFormState extends SigninFormState {
    firstName: string;
    lastName: string;
}


export const signupInitialState: SignupFormState = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
};

export const signupModel = signal(signupInitialState);
// export const signupForm = form(signupModel, (schema) => {

// });

export function createSignupForm(): FieldTree<SignupFormState> {
    const model = signal<SignupFormState>(signupInitialState);

    // Здесь form() вызовется в правильном контексте, когда мы вызовем createSignupForm() в компоненте
    return form(model, (schemaPath) => {
        // Validation and visibility logic
        required(schemaPath.email);
        email(schemaPath.email);
        // hidden(schema.shippingAddress, ({ valueOf }) => !valueOf(schema.requiresShipping));
    });
};