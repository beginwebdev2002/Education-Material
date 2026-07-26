import { AuthSessionUser } from '@shared/auth';

export interface SignUpRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface AuthResponse extends AuthSessionUser {
    accessToken: string;
}
