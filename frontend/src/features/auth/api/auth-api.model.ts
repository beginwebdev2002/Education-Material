import { UserModel } from '@entities/user/model/user.model'; // Core domain entity


// 1. Request DTO
export interface SignUpRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

// 2. Request DTO
export interface SignInRequest {
    email: string;
    password: string;
}

// 3. Response DTO
export interface SignInResponse extends UserModel {
    accessToken: string;
}