import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_ENDPOINTS } from '@shared/api/api.endpoint';
import { PaginatedResponse } from '@shared/models';
import { UserModel } from '@entities/user/model/user.model';
import { UserRole } from '@shared/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  fetchProfile(): Observable<UserModel> {
    return this.http.get<UserModel>(USER_ENDPOINTS.GET_PROFILE.url);
  }

  updateProfile(payload: Partial<UserModel>): Observable<UserModel> {
    return this.http.patch<UserModel>(USER_ENDPOINTS.UPDATE_PROFILE.url, payload);
  }

  getById(id: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${USER_ENDPOINTS.GET_BY_ID.url}/${id}`);
  }

  getAllUsers(params: { page: number; limit: number; search?: string }): Observable<PaginatedResponse<UserModel>> {
    return this.http.get<PaginatedResponse<UserModel>>(USER_ENDPOINTS.GET_ALL_USERS.url, {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.search ? { search: params.search } : {}),
      },
    });
  }

  updateRole(id: string, role: UserRole): Observable<UserModel> {
    return this.http.patch<UserModel>(`${USER_ENDPOINTS.UPDATE_ROLE.url}/${id}/role`, { role });
  }

  setBanned(id: string, isBanned: boolean): Observable<UserModel> {
    return this.http.patch<UserModel>(`${USER_ENDPOINTS.UPDATE_BAN.url}/${id}/ban`, { isBanned });
  }
}
