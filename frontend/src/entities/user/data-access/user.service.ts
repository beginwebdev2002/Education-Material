import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '@features/auth/models/signup.dto';
import { User } from '../model/user.interface';
import { tap } from 'rxjs';
// import { USER_ENDPOINTS } from '@core/api';

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
    // return this.http.put<AuthResponse>(USER_ENDPOINTS().UPDATE_PROFILE.url, this.currentUser());
  }

  fetchProfile() {
    // return this.http.get<AuthResponse>(USER_ENDPOINTS().GET_PROFILE.url, { withCredentials: true });
  }

  deleteUser() {
    // return this.http.delete(USER_ENDPOINTS().DELETE_PROFILE.url).pipe(
    //   tap(() => {
    //     this.clearUser();
    //   })
    // );
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
