import { UserRole } from '@shared/auth';

export interface UserModel {
    _id: string;
    avatar?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    phoneNumber?: string;
    country?: string;
    telegramLink?: string;
    instagramLink?: string;
    linkedinLink?: string;
    whatsappLink?: string;
    isBanned?: boolean;
    lastSeenAt?: string | null;
    createdAt?: string;
}

export type { UserRole };
