
import { Injectable, signal, Signal } from '@angular/core';
import { UserModel } from '@entities/user';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserStorageService {
    private readonly USER_KEY = 'currentUserData';
    userData$ = new Subject<UserModel | null>();
    saveUser(data: any): void {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(this.USER_KEY, serializedData);
            this.userData$.next(data);
        } catch (e) {
            console.error("Ошибка при сохранении в localStorage", e);
        }
    }

    loadUser(): Signal<UserModel | null> {
        try {
            const serializedData = localStorage.getItem(this.USER_KEY);
            if (serializedData === null) {
                return signal(null);
            }
            const parsedData = JSON.parse(serializedData)
            this.userData$.next(parsedData);
            return signal(parsedData);
        } catch (e) {
            console.error("Ошибка при загрузке из localStorage", e);
            this.userData$.next(null);
            return signal(null);
        }
    }

    clearUser(): void {
        localStorage.removeItem(this.USER_KEY);
        this.userData$.next(null)
    }
}