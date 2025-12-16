import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserModel } from '@entities/user/model/user.model';
import { SignInResponse, SignUpRequest } from '@features/auth';
import { Observable, tap } from 'rxjs';
import { SignInRequest } from '@features/auth';
import { AUTH_ENDPOINTS } from '@core/api';
import { USER_ENDPOINTS } from '@core/api';
import { UserService } from '@entities/user';
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
        return this.http.post<SignInResponse>(AUTH_ENDPOINTS.SIGN_IN.url, payload, { withCredentials: true });
    }


    logout(): void {
        this.userStorageService.clearUser();
    }
}