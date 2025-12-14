import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@entities/user/model/user.interface';
import { AuthResponse, SignupPayload } from '@features/auth/models/signup.dto';
import { Observable } from 'rxjs';
import { SigninDto } from './models/signin.dto';
import { AUTH_ENDPOINTS } from '@core/api/auth.endpoints';
import { USER_ENDPOINTS } from '@core/api/user.endpoints';

@Injectable()
export class AuthService {
    private http: HttpClient = inject(HttpClient);
    signup(payload: SignupPayload): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(AUTH_ENDPOINTS.SIGN_UP.url, payload, { withCredentials: true });
    }

    signin(payload: SigninDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(AUTH_ENDPOINTS.SIGN_IN.url, payload, { withCredentials: true });
    }

    getAllUsers() {
        return this.http.get<User[]>(USER_ENDPOINTS.GET_ALL_USERS.url)
    }


    logout(): void {
    }
}