import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
<<<<<<< HEAD:frontend/src/features/auth/auth.service.ts
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '@shared/api/api.endpoint';
import { SessionStore, TokenStorageService } from '@shared/auth';
import { AuthResponse, SignInRequest, SignUpRequest } from '@features/auth/api/auth-api.model';
=======
import { SignInRequest, SignInResponse, SignUpRequest } from './auth-api.model';
import { Observable, tap } from 'rxjs';
import { AUTH_ENDPOINTS } from '@shared/api';
import { UserStorageService } from '@core/storage';
>>>>>>> 8799246afdbac4070d608d8196a352baa8a78d31:frontend/src/features/auth/api/auth.service.ts

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly tokenStorage = inject(TokenStorageService);
    private readonly sessionStore = inject(SessionStore);

    signup(payload: SignUpRequest): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(AUTH_ENDPOINTS.SIGN_UP.url, payload, { withCredentials: true })
            .pipe(tap((response) => this.applySession(response)));
    }

    signin(payload: SignInRequest): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(AUTH_ENDPOINTS.SIGN_IN.url, payload, { withCredentials: true })
            .pipe(tap((response) => this.applySession(response)));
    }

    logout(): void {
        this.http.post(AUTH_ENDPOINTS.LOGOUT.url, {}, { withCredentials: true }).subscribe({
            complete: () => this.clearSession(),
            error: () => this.clearSession(),
        });
    }

    /** Attempts to hydrate the session on app start, silently failing when the user isn't signed in. */
    bootstrap(): Observable<boolean> {
        return this.http.get(USER_ENDPOINTS.GET_PROFILE.url).pipe(
            tap((user) => this.sessionStore.setSession(user as AuthResponse['user'])),
            map(() => true),
            catchError(() => {
                this.clearSession();
                return of(false);
            }),
        );
    }

    private applySession(response: AuthResponse): void {
        this.tokenStorage.setAccessToken(response.accessToken);
        this.sessionStore.setSession(response.user);
    }

    private clearSession(): void {
        this.tokenStorage.clearAccessToken();
        this.sessionStore.clearSession();
    }
}
