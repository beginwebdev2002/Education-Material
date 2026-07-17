
import { Injectable, signal, Signal } from '@angular/core';
import { UserModel } from '@entities/user';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserStorageService {
    private readonly USER_KEY = 'currentUserData';
    private readonly currentUserSignal = signal<UserModel | null>(this.readFromStorage());
    userData$ = new Subject<UserModel | null>();

    private readFromStorage(): UserModel | null {
        try {
            const serializedData = localStorage.getItem(this.USER_KEY);
            return serializedData === null ? null : JSON.parse(serializedData);
        } catch (e) {
            console.error("Ошибка при загрузке из localStorage", e);
            return null;
        }
    }

    saveUser(data: any): void {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(this.USER_KEY, serializedData);
            if (data?.accessToken) {
                localStorage.setItem('access_token', data.accessToken);
            }
            this.currentUserSignal.set(data);
            this.userData$.next(data);
        } catch (e) {
            console.error("Ошибка при сохранении в localStorage", e);
        }
    }

    // Returns the same persistent signal on every call so templates keep
    // tracking it after login/logout instead of a one-time snapshot.
    loadUser(): Signal<UserModel | null> {
        return this.currentUserSignal.asReadonly();
    }

    clearUser(): void {
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem('access_token');
        this.currentUserSignal.set(null);
        this.userData$.next(null)
    }
}