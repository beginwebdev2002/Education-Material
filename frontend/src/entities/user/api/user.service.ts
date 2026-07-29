import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_ENDPOINTS } from '@shared/api';
import { PaginatedResponse } from '@shared/models';
import { UserModel, UserRole } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  getAllUsers(params: { page: number; limit: number; search?: string }): Observable<PaginatedResponse<UserModel>> {
    const query: Record<string, string | number> = { page: params.page, limit: params.limit };
    if (params.search) {
      query['search'] = params.search;
    }
    return this.http.get<PaginatedResponse<UserModel>>(USER_ENDPOINTS.GET_ALL_USERS.url, { params: query });
  }

  getById(id: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${USER_ENDPOINTS.GET_BY_ID.url}/${id}`);
  }

  getProfile(): Observable<UserModel> {
    return this.http.get<UserModel>(USER_ENDPOINTS.GET_PROFILE.url);
  }

  updateProfile(data: Partial<UserModel>): Observable<UserModel> {
    return this.http.patch<UserModel>(USER_ENDPOINTS.UPDATE_PROFILE.url, data);
  }

  uploadAvatar(file: File): Observable<UserModel> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<UserModel>(USER_ENDPOINTS.UPLOAD_AVATAR.url, formData);
  }

  updateRole(id: string, role: UserRole): Observable<UserModel> {
    return this.http.patch<UserModel>(`${USER_ENDPOINTS.UPDATE_ROLE.url}/${id}`, { role });
  }

  setBanned(id: string, isBanned: boolean): Observable<UserModel> {
    return this.http.patch<UserModel>(`${USER_ENDPOINTS.UPDATE_BAN.url}/${id}`, { isBanned });
  }
}
