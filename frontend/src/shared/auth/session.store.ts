import { Injectable, computed, signal } from '@angular/core';
import { AuthSessionUser } from './model/session-user.model';
import { UserRole } from './model/role.model';

/** Single source of truth for "who is signed in right now" across the whole app. */
@Injectable({ providedIn: 'root' })
export class SessionStore {
    private readonly currentUserSignal = signal<AuthSessionUser | null>(null);
    private readonly initializedSignal = signal(false);

    readonly currentUser = this.currentUserSignal.asReadonly();
    readonly initialized = this.initializedSignal.asReadonly();
    readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
    readonly role = computed<UserRole | null>(() => this.currentUserSignal()?.role ?? null);
    readonly isAdmin = computed(() => this.role() === 'ADMIN');

    setSession(user: AuthSessionUser): void {
        this.currentUserSignal.set(user);
        this.initializedSignal.set(true);
    }

    clearSession(): void {
        this.currentUserSignal.set(null);
        this.initializedSignal.set(true);
    }
}
