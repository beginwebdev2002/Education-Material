import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTOCOMPLETE_ENDPOINTS } from '@shared/api';
import { PaginatedResponse } from '@shared/models';
import { AutocompleteItem, CreateAutocompleteItemPayload, UpdateAutocompleteItemPayload } from '../model/autocomplete-item.model';

export interface AdminItemListParams {
    listId: string;
    parentItem?: string;
    search?: string;
    page: number;
    limit: number;
}

export interface PublicItemListParams {
    listKey: string;
    parentItem?: string;
    search?: string;
    page?: number;
    limit?: number;
}

function toHttpParams(params: AdminItemListParams | PublicItemListParams): HttpParams {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params) as [string, string | number | undefined][]) {
        if (value !== undefined && value !== '') {
            httpParams = httpParams.set(key, value);
        }
    }
    return httpParams;
}

@Injectable({ providedIn: 'root' })
export class AutocompleteItemService {
    private readonly http = inject(HttpClient);

    adminList(params: AdminItemListParams): Observable<PaginatedResponse<AutocompleteItem>> {
        return this.http.get<PaginatedResponse<AutocompleteItem>>(AUTOCOMPLETE_ENDPOINTS.LIST_ITEMS.url, { params: toHttpParams(params) });
    }

    getById(id: string): Observable<AutocompleteItem> {
        return this.http.get<AutocompleteItem>(`${AUTOCOMPLETE_ENDPOINTS.GET_ITEM.url}/${id}`);
    }

    create(payload: CreateAutocompleteItemPayload): Observable<AutocompleteItem> {
        return this.http.post<AutocompleteItem>(AUTOCOMPLETE_ENDPOINTS.CREATE_ITEM.url, payload);
    }

    update(id: string, payload: UpdateAutocompleteItemPayload): Observable<AutocompleteItem> {
        return this.http.patch<AutocompleteItem>(`${AUTOCOMPLETE_ENDPOINTS.UPDATE_ITEM.url}/${id}`, payload);
    }

    remove(id: string): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(`${AUTOCOMPLETE_ENDPOINTS.DELETE_ITEM.url}/${id}`);
    }

    publicItemsByKey(params: PublicItemListParams): Observable<PaginatedResponse<AutocompleteItem>> {
        return this.http.get<PaginatedResponse<AutocompleteItem>>(AUTOCOMPLETE_ENDPOINTS.PUBLIC_ITEMS.url, { params: toHttpParams(params) });
    }
}
