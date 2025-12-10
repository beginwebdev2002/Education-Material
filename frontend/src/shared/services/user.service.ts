import { Injectable, Signal, inject } from '@angular/core';
import { UserEndPoints } from '@entities/users/users.constants';
import { AuthResponse, SignupPayload } from '@features/auth/models/signup.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { computed, signal } from '@angular/core';
import { User } from '@entities/users/model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private currentUserSignal = signal<AuthResponse | null>(null);

  currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();

  isAuthenticated = computed(() => this.currentUser() !== null);

  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  setUser(user: AuthResponse): void {
    this.currentUserSignal.set(user);
    localStorage.setItem("userId", user._id);
    localStorage.setItem('accessToken', user.accessToken);
  }
  findUserById(id: string): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(UserEndPoints.getUserById(id))
  }

  clearUser(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
  }
  logout(): void {
    this.currentUserSignal.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("userId");
    }
  }
}
