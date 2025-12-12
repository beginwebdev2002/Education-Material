import { Injectable, Signal, computed, signal } from '@angular/core';
import { AuthResponse } from '@features/auth/models/signup.interface';
import { User } from '@entities/users/model/user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthStateService {
    private currentUserSignal = signal<AuthResponse | null>(null);

    currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();

    isAuthenticated = computed(() => this.currentUser() !== null);

    isAdmin = computed(() => this.currentUser()?.role === 'admin');

    setUser(user: AuthResponse): void {
        this.currentUserSignal.set(user);
        if (typeof window !== 'undefined') {
            localStorage.setItem("userId", user._id);
            localStorage.setItem('accessToken', user.accessToken);
        }
    }

    clearUser(): void {
        this.currentUserSignal.set(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
        }
    }

    logout(): void {
        this.clearUser();
    }
}
