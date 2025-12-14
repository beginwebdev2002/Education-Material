import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '@features/auth/models/signup.dto';
import { UserEndPoints } from '../constants/users.constants';
import { User } from '../model/user.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  private currentUserSignal = signal<AuthResponse | null>(null);

  currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();

  isAuthenticated = computed(() => this.currentUser() !== null);

  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  updateProfile() {
    return this.http.put<AuthResponse>(UserEndPoints.fetchProfile, this.currentUser());
  }

  fetchProfile() {
    return this.http.get<AuthResponse>(UserEndPoints.fetchProfile);
  }

  deleteUser() {
    return this.http.delete(UserEndPoints.deleteUserUrl(this.currentUser()!._id)).pipe(
      tap(() => {
        this.clearUser();
      })
    );
  }

  public setUser(user: AuthResponse): void {
    this.currentUserSignal.set(user);
  }

  clearUser(): void {
    this.currentUserSignal.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
    }
  }

}
