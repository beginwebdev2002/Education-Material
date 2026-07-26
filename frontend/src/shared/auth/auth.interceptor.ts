import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from '@shared/api/api.config';
import { TokenStorageService } from './token-storage.service';
import { SessionStore } from './session.store';
import { RefreshCoordinatorService } from './refresh-coordinator.service';

const AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH = ['/auth/signin', '/auth/signup', '/auth/refresh', '/auth/logout'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.url.startsWith(API_BASE_URL)) {
        return next(req);
    }

    const tokenStorage = inject(TokenStorageService);
    const sessionStore = inject(SessionStore);
    const refreshCoordinator = inject(RefreshCoordinatorService);

    const accessToken = tokenStorage.getAccessToken();
    const authorizedReq = accessToken
        ? req.clone({ withCredentials: true, setHeaders: { Authorization: `Bearer ${accessToken}` } })
        : req.clone({ withCredentials: true });

    const isExemptFromRefresh = AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH.some((path) => req.url.includes(path));

    return next(authorizedReq).pipe(
        catchError((error: unknown) => {
            if (!(error instanceof HttpErrorResponse) || error.status !== 401 || isExemptFromRefresh) {
                return throwError(() => error);
            }

            return refreshCoordinator.refreshAccessToken().pipe(
                switchMap((newAccessToken) => {
                    const retriedReq = req.clone({ withCredentials: true, setHeaders: { Authorization: `Bearer ${newAccessToken}` } });
                    return next(retriedReq);
                }),
                catchError((refreshError: unknown) => {
                    tokenStorage.clearAccessToken();
                    sessionStore.clearSession();
                    return throwError(() => refreshError);
                }),
            );
        }),
    );
};
