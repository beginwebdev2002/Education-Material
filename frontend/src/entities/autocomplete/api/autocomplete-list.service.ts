import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTOCOMPLETE_ENDPOINTS } from '@shared/api';
import { PaginatedResponse } from '@shared/models';
import { AutocompleteList, CreateAutocompleteListPayload, UpdateAutocompleteListPayload } from '../model/autocomplete-list.model';

@Injectable({ providedIn: 'root' })
export class AutocompleteListService {
    private readonly http = inject(HttpClient);

    adminList(page: number, limit: number): Observable<PaginatedResponse<AutocompleteList>> {
        const params = new HttpParams().set('page', page).set('limit', limit);
        return this.http.get<PaginatedResponse<AutocompleteList>>(AUTOCOMPLETE_ENDPOINTS.LIST_LISTS.url, { params });
    }

    getById(id: string): Observable<AutocompleteList> {
        return this.http.get<AutocompleteList>(`${AUTOCOMPLETE_ENDPOINTS.GET_LIST.url}/${id}`);
    }

    create(payload: CreateAutocompleteListPayload): Observable<AutocompleteList> {
        return this.http.post<AutocompleteList>(AUTOCOMPLETE_ENDPOINTS.CREATE_LIST.url, payload);
    }

    update(id: string, payload: UpdateAutocompleteListPayload): Observable<AutocompleteList> {
        return this.http.patch<AutocompleteList>(`${AUTOCOMPLETE_ENDPOINTS.UPDATE_LIST.url}/${id}`, payload);
    }

    remove(id: string): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(`${AUTOCOMPLETE_ENDPOINTS.DELETE_LIST.url}/${id}`);
    }
}
