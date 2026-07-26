import { UserRole } from './user.interface';
import { Users, UsersDocument } from "./users.schema";

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

export interface IUserRepository {
    // CRUD операции
    create(userDto: Partial<Users>): Promise<UsersDocument>;
    findById(id: string): Promise<UsersDocument | null>;
    update(id: string, updateData: Partial<Users>): Promise<UsersDocument | null>;
    delete(id: string): Promise<boolean>;

    // Специфический запрос для домена
    findByEmail(email: string): Promise<UsersDocument | null>;
    findAll(): Promise<UsersDocument[]>;
    findAllPaginated(params: { search?: string; page: number; limit: number }): Promise<PaginatedResult<UsersDocument>>;

    touchLastSeen(id: string): Promise<void>;
    setRole(id: string, role: UserRole): Promise<UsersDocument | null>;
    setBanned(id: string, isBanned: boolean): Promise<UsersDocument | null>;

    countAll(): Promise<number>;
    countActiveSince(date: Date): Promise<number>;
    countOnlineSince(date: Date): Promise<number>;
    findOnlineSince(date: Date, limit: number): Promise<UsersDocument[]>;
    registrationsSeriesSince(date: Date): Promise<{ date: string; count: number }[]>;
}
