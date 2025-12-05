// Defining the User interface
export interface User {
  id: string; // UUID
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  socialMedia?: {
    telegram?: string;
    instagram?: string;
    linkedIn?: string;
    whatsapp?: string;
    github?: string;
  };
  citizenship?: string;
  bio?: string;
  diplomaUrl?: string;
  articles?: string[];
  usefulLinks?: string[];
}