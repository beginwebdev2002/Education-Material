import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsAllowedHostConstraint implements ValidatorConstraintInterface {
    validate(url: string, args: ValidationArguments) {
        const [allowedHosts] = args.constraints;
        try {
            const urlObj = new URL(url);
            return allowedHosts.some((host: string) => urlObj.hostname.includes(host));
        } catch (error) {
            return false; // Invalid URL
        }
    }

    defaultMessage(args: ValidationArguments) {
        const [allowedHosts] = args.constraints;
        return `URL host must be one of the following: ${allowedHosts.join(', ')}`;
    }
}

export function IsAllowedHost(allowedHosts: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [allowedHosts],
            validator: IsAllowedHostConstraint,
        });
    };
}
