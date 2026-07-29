import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { COMMENTS_ENDPOINTS } from '@shared/api';
import { PaginatedResponse } from '@shared/models';
import { Comment } from '../model/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
    private readonly http = inject(HttpClient);

    listForMaterial(materialId: string, page = 1, limit = 20): Observable<PaginatedResponse<Comment>> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<PaginatedResponse<Comment>>(`${COMMENTS_ENDPOINTS.LIST_FOR_MATERIAL.url}/${materialId}/comments`, { params });
    }

    create(materialId: string, text: string): Observable<Comment> {
        return this.http.post<Comment>(`${COMMENTS_ENDPOINTS.CREATE.url}/${materialId}/comments`, { text });
    }

    remove(id: string): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(`${COMMENTS_ENDPOINTS.DELETE.url}/${id}`);
    }

    adminList(page = 1, limit = 20, search?: string): Observable<PaginatedResponse<Comment>> {
        let params = new HttpParams().set('page', page).set('limit', limit);
        if (search) {
            params = params.set('search', search);
        }
        return this.http.get<PaginatedResponse<Comment>>(COMMENTS_ENDPOINTS.ADMIN_LIST.url, { params });
    }
}
