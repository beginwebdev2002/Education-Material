import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, SignupPayload } from '@features/auth/models/signup.dto';
import { UserEndPoints } from '@entities/user/constants/users.constants';
import { computed, signal } from '@angular/core';
import { User } from '@entities/user/model/user.interface';
import { map, Observable } from 'rxjs';
import { LoginDto } from './models/login.dto';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http: HttpClient = inject(HttpClient);
    signup(payload: SignupPayload): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(UserEndPoints.BASE_URL, payload, { withCredentials: true });
    }

    login(payload: LoginDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(UserEndPoints.LOGIN, payload, { withCredentials: true });
    }

    getAllUsers() {
        return this.http.get<User[]>(UserEndPoints.BASE_URL)
    }


    logout(): void {
    }
}