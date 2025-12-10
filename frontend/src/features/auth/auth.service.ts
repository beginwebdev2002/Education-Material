import { Injectable } from '@angular/core';
import { AuthResponse, SignupPayload } from './models/signup.interface';
import { UserEndPoints } from '@entities/users/users.constants';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  signup(payload: SignupPayload) {
    return this.http.post<AuthResponse>(UserEndPoints.BASE_URL, payload);
  }
}
