import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { UserModel } from '@entities/user';
import { SignInResponse } from '@features/auth';
// import { USER_ENDPOINTS } from '@core/api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  private currentUserSignal = signal<SignInResponse | null>(null);

  currentUser: Signal<UserModel | null> = this.currentUserSignal.asReadonly();

  isAuthenticated = computed(() => this.currentUser() !== null);

  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

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

  public setUser(user: SignInResponse): void {
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
