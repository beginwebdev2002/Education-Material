import { Users, UsersDocument } from "./users.schema";

export interface IUserRepository {
    // CRUD операции
    create(userDto: Partial<Users>): Promise<UsersDocument>;
    findById(id: string): Promise<UsersDocument | null>;
    update(id: string, updateData: Partial<Users>): Promise<UsersDocument | null>;
    delete(id: string): Promise<boolean>;

    // Специфический запрос для домена
    findByEmail(email: string): Promise<UsersDocument | null>;
}