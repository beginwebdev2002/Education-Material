import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '@shared/api/api.config';
import { TokenStorageService } from './token-storage.service';
import { SessionStore } from './session.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.url.startsWith(API_BASE_URL)) {
        return next(req);
    }

    const tokenStorage = inject(TokenStorageService);
    const sessionStore = inject(SessionStore);

    const accessToken = tokenStorage.getAccessToken();
    const authorizedReq = accessToken
        ? req.clone({ withCredentials: true, setHeaders: { Authorization: `Bearer ${accessToken}` } })
        : req.clone({ withCredentials: true });

    return next(authorizedReq).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                tokenStorage.clearAccessToken();
                sessionStore.clearSession();
            }
            return throwError(() => error);
        }),
    );
};
