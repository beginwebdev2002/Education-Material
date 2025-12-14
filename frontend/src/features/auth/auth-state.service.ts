import { Injectable, Signal, computed, signal } from '@angular/core';
import { AuthResponse } from '@features/auth/models/signup.dto';
import { User } from '@entities/user/model/user.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthStateService {
    private currentUserSignal = signal<AuthResponse | null>(null);

    currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();

    isAuthenticated = computed(() => this.currentUser() !== null);

    isAdmin = computed(() => this.currentUser()?.role === 'admin');


    // clearUser(): void {
    //     this.currentUserSignal.set(null);
    //     if (typeof window !== 'undefined') {
    //         localStorage.removeItem('accessToken');
    //         localStorage.removeItem('userId');
    //     }
    // }

    // logout(): void {
    //     this.clearUser();
    // }
}
