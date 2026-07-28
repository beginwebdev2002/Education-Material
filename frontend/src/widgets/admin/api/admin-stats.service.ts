import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADMIN_ENDPOINTS } from '@shared/api';
import { PaginatedResponse } from '@shared/models';
import { ActivityEntry, ActivityType, AdminAnalytics, AdminOverview, OnlineUser } from '../model/admin-stats.model';

@Injectable({ providedIn: 'root' })
export class AdminStatsService {
    private readonly http = inject(HttpClient);

    overview(): Observable<AdminOverview> {
        return this.http.get<AdminOverview>(ADMIN_ENDPOINTS.OVERVIEW.url);
    }

    onlineUsers(): Observable<OnlineUser[]> {
        return this.http.get<OnlineUser[]>(ADMIN_ENDPOINTS.ONLINE_USERS.url);
    }

    analytics(days = 30): Observable<AdminAnalytics> {
        return this.http.get<AdminAnalytics>(ADMIN_ENDPOINTS.ANALYTICS.url, { params: new HttpParams().set('days', days) });
    }

    activityLog(page = 1, limit = 20, type?: ActivityType): Observable<PaginatedResponse<ActivityEntry>> {
        let params = new HttpParams().set('page', page).set('limit', limit);
        if (type) {
            params = params.set('type', type);
        }
        return this.http.get<PaginatedResponse<ActivityEntry>>(ADMIN_ENDPOINTS.ACTIVITY.url, { params });
    }
}
