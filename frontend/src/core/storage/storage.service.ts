
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly USER_KEY = 'currentUserData';
    saveUser(data: any): void {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(this.USER_KEY, serializedData);
        } catch (e) {
            console.error("Ошибка при сохранении в localStorage", e);
        }
    }

    loadUser(): any | null {
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