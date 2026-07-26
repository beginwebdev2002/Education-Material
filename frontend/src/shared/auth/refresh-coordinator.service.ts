import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, finalize, map, shareReplay, tap } from 'rxjs';
import { AUTH_ENDPOINTS } from '@shared/api/api.endpoint';
import { TokenStorageService } from './token-storage.service';
import { SessionStore } from './session.store';
import { AuthSessionUser } from './model/session-user.model';

interface RefreshResponse {
    accessToken: string;
    user: AuthSessionUser;
}

/** Coalesces concurrent 401s into a single in-flight refresh request. */
@Injectable({ providedIn: 'root' })
export class RefreshCoordinatorService {
    private readonly http = inject(HttpClient);
    private readonly tokenStorage = inject(TokenStorageService);
    private readonly sessionStore = inject(SessionStore);

    private refreshing$: Observable<string> | null = null;

    refreshAccessToken(): Observable<string> {
        if (!this.refreshing$) {
            this.refreshing$ = this.http
                .post<RefreshResponse>(AUTH_ENDPOINTS.REFRESH.url, {}, { withCredentials: true })
                .pipe(
                    tap((response) => {
                        this.tokenStorage.setAccessToken(response.accessToken);
                        this.sessionStore.setSession(response.user);
                    }),
                    map((response) => response.accessToken),
                    shareReplay(1),
                    finalize(() => { this.refreshing$ = null; }),
                );
        }
        return this.refreshing$;
    }
}
