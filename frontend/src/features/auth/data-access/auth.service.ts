import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, SignupPayload } from '../models/signup.interface';
import { UserEndPoints } from '@entities/users/users.constants';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);

    signup(payload: SignupPayload) {
        return this.http.post<AuthResponse>(UserEndPoints.BASE_URL, payload);
    }
}