import { Users, UsersDocument } from "./users.schema";

export interface PaginatedUsers {
    items: UsersDocument[];
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
    findAll(page: number, limit: number): Promise<PaginatedUsers>;

    // Специфический запрос для домена
    findByEmail(email: string): Promise<UsersDocument | null>;
}