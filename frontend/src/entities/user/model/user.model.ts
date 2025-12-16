export interface UserModel {
    _id: string; // UUID
    avatar?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    password?: string;
    role: UserRole;
    phoneNumber?: string;
    telegram?: string;
    instagram?: string;
    linkedIn?: string;
    whatsapp?: string;
    github?: string;
    citizenship?: string;
    bio?: string;
}

export type UserRole = 'USER' | 'ADMIN'