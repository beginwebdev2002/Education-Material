import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { USER_ENDPOINTS } from '@shared/api';
import { UserModel } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  getAllUsers() {
    return this.http.get<UserModel[]>(USER_ENDPOINTS.GET_ALL_USERS.url);
  }
}
