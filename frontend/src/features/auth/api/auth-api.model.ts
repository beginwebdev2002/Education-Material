<<<<<<< HEAD
import { AuthSessionUser } from '@shared/auth';
=======
import { UserModel } from '@entities/user';
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31

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

export interface AuthResponse {
    accessToken: string;
    user: AuthSessionUser;
}
