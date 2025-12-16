import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserModel } from '@entities/user/model/user.model';
import { SignInResponse, SignUpRequest } from '@features/auth';
import { Observable } from 'rxjs';
import { SignInRequest } from '@features/auth';
import { AUTH_ENDPOINTS } from '@core/api';
import { USER_ENDPOINTS } from '@core/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http: HttpClient = inject(HttpClient);
    signup(payload: SignUpRequest): Observable<SignInResponse> {
        return this.http.post<SignInResponse>(AUTH_ENDPOINTS.SIGN_UP.url, payload, { withCredentials: true });
    }

    signin(payload: SignInRequest): Observable<SignInResponse> {
        return this.http.post<SignInResponse>(AUTH_ENDPOINTS.SIGN_IN.url, payload, { withCredentials: true });
    }

    getAllUsers() {
        return this.http.get<UserModel[]>(USER_ENDPOINTS.GET_ALL_USERS.url)
    }


    logout(): void {
    }
}