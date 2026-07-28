import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MATERIALS_ENDPOINTS } from '@shared/api';
import { PaginatedResponse } from '@shared/models';
import { saveBlobResponse } from '@shared/lib';
import { CreateMaterialPayload, Material, MaterialCategory, MaterialStatus } from '../model/material.model';

export interface MaterialListParams {
    search?: string;
    sortBy?: 'downloads' | 'date';
    category?: MaterialCategory;
    dateFrom?: string;
    dateTo?: string;
    page: number;
    limit: number;
}

export interface AdminMaterialListParams {
    search?: string;
    status?: MaterialStatus;
    category?: MaterialCategory;
    page: number;
    limit: number;
}

function toHttpParams(params: MaterialListParams | AdminMaterialListParams): HttpParams {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params) as [string, string | number | undefined][]) {
        if (value !== undefined && value !== '') {
            httpParams = httpParams.set(key, value);
        }
    }
    return httpParams;
}

@Injectable({ providedIn: 'root' })
export class MaterialService {
    private readonly http = inject(HttpClient);

    list(params: MaterialListParams): Observable<PaginatedResponse<Material>> {
        return this.http.get<PaginatedResponse<Material>>(MATERIALS_ENDPOINTS.LIST.url, { params: toHttpParams(params) });
    }

    mine(page: number, limit: number): Observable<PaginatedResponse<Material>> {
        return this.http.get<PaginatedResponse<Material>>(MATERIALS_ENDPOINTS.MINE.url, { params: toHttpParams({ page, limit }) });
    }

    adminList(params: AdminMaterialListParams): Observable<PaginatedResponse<Material>> {
        return this.http.get<PaginatedResponse<Material>>(MATERIALS_ENDPOINTS.ADMIN_LIST.url, { params: toHttpParams(params) });
    }

    getById(id: string): Observable<Material> {
        return this.http.get<Material>(`${MATERIALS_ENDPOINTS.GET_BY_ID.url}/${id}`);
    }

    upload(payload: CreateMaterialPayload): Observable<Material> {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('institution', payload.institution);
        formData.append('subject', payload.subject);
        payload.category.forEach((category) => formData.append('category', category));
        payload.files.forEach((file) => formData.append('files', file));
        return this.http.post<Material>(MATERIALS_ENDPOINTS.UPLOAD.url, formData);
    }

    download(material: Material): void {
        this.http
            .get(`${MATERIALS_ENDPOINTS.DOWNLOAD.url}/${material._id}/download`, { responseType: 'blob', observe: 'response' })
            .subscribe((response) => saveBlobResponse(response, material.originalName));
    }

    remove(id: string): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(`${MATERIALS_ENDPOINTS.DELETE.url}/${id}`);
    }

    updateStatus(id: string, status: MaterialStatus): Observable<Material> {
        return this.http.patch<Material>(`${MATERIALS_ENDPOINTS.UPDATE_STATUS.url}/${id}/status`, { status });
    }
}
