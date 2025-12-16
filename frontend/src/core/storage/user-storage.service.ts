
import { Injectable } from '@angular/core';
import { UserModel } from '@entities/user';

@Injectable({
    providedIn: 'root'
})
export class UserStorageService {
    private readonly USER_KEY = 'currentUserData';
    saveUser(data: any): void {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(this.USER_KEY, serializedData);
        } catch (e) {
            console.error("Ошибка при сохранении в localStorage", e);
        }
    }

    loadUser(): UserModel | null {
        try {
            const serializedData = localStorage.getItem(this.USER_KEY);
            if (serializedData === null) {
                return null;
            }
            return JSON.parse(serializedData);
        } catch (e) {
            console.error("Ошибка при загрузке из localStorage", e);
            return null;
        }
    }

    clearUser(): void {
        localStorage.removeItem(this.USER_KEY);
    }
}