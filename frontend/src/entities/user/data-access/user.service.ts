import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { USER_ENDPOINTS } from '@core/api';
import { UserModel } from '@entities/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
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

  getAllUsers() {
    return this.http.get<UserModel[]>(USER_ENDPOINTS.GET_ALL_USERS.url);
  }

}
