import { User } from "@entities/users/model/user.interface";

export interface SignupPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse extends User {
    accessToken: string;
}