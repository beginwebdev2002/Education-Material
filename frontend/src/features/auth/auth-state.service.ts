import { Injectable, Signal, computed, signal } from '@angular/core';
import { SignInResponse } from '@features/auth';
import { UserModel } from '@entities/user';

@Injectable({
    providedIn: 'root',
})
export class AuthStateService {
    private currentUserSignal = signal<SignInResponse | null>(null);

    currentUser: Signal<UserModel | null> = this.currentUserSignal.asReadonly();

    isAuthenticated = computed(() => this.currentUser() !== null);

    isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
}
