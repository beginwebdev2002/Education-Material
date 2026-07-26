import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '@shared/api/api.endpoint';
import { AuthSessionUser, SessionStore, TokenStorageService } from '@shared/auth';
import { AuthResponse, SignInRequest, SignUpRequest } from '@features/auth/api/auth-api.model';

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
        return this.http.get<AuthSessionUser>(USER_ENDPOINTS.GET_PROFILE.url).pipe(
            tap((user) => this.sessionStore.setSession(user)),
            map(() => true),
            catchError(() => {
                this.clearSession();
                return of(false);
            }),
        );
    }

    private applySession(response: AuthResponse): void {
        const { accessToken, ...user } = response;
        this.tokenStorage.setAccessToken(accessToken);
        this.sessionStore.setSession(user);
    }

    private clearSession(): void {
        this.tokenStorage.clearAccessToken();
        this.sessionStore.clearSession();
    }
}
