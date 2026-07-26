import { UserRole } from './role.model';

/** Minimal identity carried by the session — enough to render the header/guards without a profile fetch. */
export interface AuthSessionUser {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: UserRole;
}
