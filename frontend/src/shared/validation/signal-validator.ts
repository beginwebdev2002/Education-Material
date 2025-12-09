import { Signal, computed } from '@angular/core';

export type SignalValidatorFn<T> = (value: T) => string | null;

export function createValidationSignal<T>(
    valueSignal: Signal<T>,
    validators: SignalValidatorFn<T>[]
): Signal<string[]> {
    return computed(() => {
        const value = valueSignal();
        const errors: string[] = [];

        for (const validator of validators) {
            const error = validator(value);
            if (error) {
                errors.push(error);
            }
        }

        return errors;
    });
}

export function requiredValidator(value: string): string | null {
    if (typeof value === 'string' && value.trim().length === 0) {
        return 'This is a required field.';
    }
    return null;
}

export function minLengthValidator(minLength: number): SignalValidatorFn<string> {
    return (value: string) => {
        if (typeof value === 'string' && value.length < minLength) {
            return `Minimum length: ${minLength} characters.`;
        }
        return null;
    };
}

export function maxLengthValidator(maxLength: number): SignalValidatorFn<string> {
    return (value: string) => {
        if (typeof value === 'string' && value.length > maxLength) {
            return `Maximum length: ${maxLength} characters.`;
        }
        return null;
    };
}

export function lengthValidator(minLength: number, maxLength: number): SignalValidatorFn<string> {
    return (value: string) => {
        if (typeof value === 'string' && (value.length < minLength || value.length > maxLength)) {
            return `Length must be between ${minLength} and ${maxLength} characters.`;
        }
        return null;
    };
}

export function patternValidator(pattern: RegExp): SignalValidatorFn<string> {
    return (value: string) => {
        if (typeof value === 'string' && !pattern.test(value)) {
            return `Value must match pattern: ${pattern.source}`;
        }
        return null;
    };
}

export function emailValidator(value: string): string | null {
    if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email format.';
    }
    return null;
}

export function minValidator(min: number): SignalValidatorFn<number> {
    return (value: number) => {
        if (typeof value === 'number' && value < min) {
            return `Value must be at least ${min}.`;
        }
        return null;
    };
}

export function maxValidator(max: number): SignalValidatorFn<number> {
    return (value: number) => {
        if (typeof value === 'number' && value > max) {
            return `Value must be at most ${max}.`;
        }
        return null;
    };
}

export function minMaxValidator(min: number, max: number): SignalValidatorFn<number> {
    return (value: number) => {
        if (typeof value === 'number' && (value < min || value > max)) {
            return `Value must be between ${min} and ${max}.`;
        }
        return null;
    };
}