import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, SignupPayload } from '@features/auth/models/signup.dto';
import { UserEndPoints } from '@entities/users/users.constants';
import { computed, signal } from '@angular/core';
import { User } from '@entities/users/model/user.interface';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/login.dto';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);

    private currentUserSignal = signal<AuthResponse | null>(null);

    currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();

    isAuthenticated = computed(() => this.currentUser() !== null);

    isAdmin = computed(() => this.currentUser()?.role === 'admin');

    signup(payload: SignupPayload): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(UserEndPoints.BASE_URL, payload);
    }

    login(payload: LoginDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(UserEndPoints.LOGIN, payload);
    }

    getAllUsers() {
        return this.http.get<User[]>(UserEndPoints.BASE_URL)
    }

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