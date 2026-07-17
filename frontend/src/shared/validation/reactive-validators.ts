import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function requiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (typeof value === 'string' && value.trim().length === 0) {
            return { required: 'This is a required field.' };
        }
        if (value === null || value === undefined || value === '') {
            return { required: 'This is a required field.' };
        }
        return null;
    };
}

export function minLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }
        if (typeof value === 'string' && value.length < minLength) {
            return { minlength: `Minimum length: ${minLength} characters.` };
        }
        return null;
    };
}

export function maxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }
        if (typeof value === 'string' && value.length > maxLength) {
            return { maxlength: `Maximum length: ${maxLength} characters.` };
        }
        return null;
    };
}

export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }
        if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return { email: 'Invalid email format.' };
        }
        return null;
    };
}

export function minValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value === null || value === undefined || value === '') {
            return null;
        }
        if (Number(value) < min) {
            return { min: `Value must be at least ${min}.` };
        }
        return null;
    };
}

export function maxValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value === null || value === undefined || value === '') {
            return null;
        }
        if (Number(value) > max) {
            return { max: `Value must be at most ${max}.` };
        }
        return null;
    };
}

export function integerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value === null || value === undefined || value === '') {
            return null;
        }
        if (!Number.isInteger(Number(value))) {
            return { integer: 'Must be a whole number.' };
        }
        return null;
    };
}

/** Returns the first validation error message on a control, or null if valid/untouched-irrelevant. */
export function firstError(control: AbstractControl | null | undefined): string | null {
    if (!control || !control.errors) {
        return null;
    }
    const values = Object.values(control.errors);
    return values.length > 0 ? String(values[0]) : null;
}
