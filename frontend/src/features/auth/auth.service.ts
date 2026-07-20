import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SignInRequest, SignInResponse, SignUpRequest } from '@features/auth';
import { Observable, tap } from 'rxjs';
import { AUTH_ENDPOINTS } from '@shared/api';
import { UserStorageService } from '@core/storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http: HttpClient = inject(HttpClient);
    private userStorageService: UserStorageService = inject(UserStorageService);
    signup(payload: SignUpRequest): Observable<SignInResponse> {
        return this.http
            .post<SignInResponse>(AUTH_ENDPOINTS.SIGN_UP.url, payload, { withCredentials: true })
            .pipe(
                tap((user) => {
                    this.userStorageService.saveUser(user);
                })
            )
    }

    signin(payload: SignInRequest): Observable<SignInResponse> {
        return this.http.post<SignInResponse>(AUTH_ENDPOINTS.SIGN_IN.url, payload, { withCredentials: true })
            .pipe(
                tap((user) => {
                    this.userStorageService.saveUser(user);
                })
            );
    }


    logout(): void {
        this.userStorageService.clearUser();
    }
}