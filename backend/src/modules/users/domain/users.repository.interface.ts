import { Users } from "./users.schema";

export interface IUserRepository {
    // CRUD операции
    create(userDto: Partial<Users>): Promise<Users>;
    findById(id: string): Promise<Users | null>;
    update(id: string, updateData: Partial<Users>): Promise<Users | null>;
    delete(id: string): Promise<boolean>;

    // Специфический запрос для домена
    findByEmail(email: string): Promise<Users | null>;
}