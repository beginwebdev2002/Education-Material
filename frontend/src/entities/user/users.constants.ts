import { environment } from "@environments/environment";

export class UserEndPoints {
    private static readonly API_URL = environment.apiUrl;
    static readonly BASE_URL = `${this.API_URL}/users`;
    static readonly LOGIN = `${this.BASE_URL}/login`;
    static getOneUser(id: string) {
        return `${this.BASE_URL}/${id}`;
    }

    static getUserById(id: string) {
        return `${this.BASE_URL}/${id}`;
    }
}