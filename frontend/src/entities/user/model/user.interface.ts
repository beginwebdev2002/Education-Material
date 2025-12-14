export interface User {
    _id: string; // UUID
    avatar?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    password?: string;
    role: 'user' | 'admin';
    phoneNumber?: string;
    telegram?: string;
    instagram?: string;
    linkedIn?: string;
    whatsapp?: string;
    github?: string;
    citizenship?: string;
    bio?: string;
}