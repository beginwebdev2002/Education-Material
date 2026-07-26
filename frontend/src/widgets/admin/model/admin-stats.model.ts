import { Material } from '@entities/material';

export type ActivityType =
    | 'REGISTER'
    | 'LOGIN'
    | 'LOGOUT'
    | 'PROFILE_UPDATE'
    | 'MATERIAL_UPLOAD'
    | 'MATERIAL_DOWNLOAD'
    | 'MATERIAL_COMMENT'
    | 'MATERIAL_STATUS_CHANGE';

export interface ActivityActor {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
    role: string;
}

export interface ActivityEntry {
    _id: string;
    user: ActivityActor | null;
    type: ActivityType;
    material?: { _id: string; title: string } | null;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

export interface AdminOverview {
    totalUsers: number;
    onlineUsersCount: number;
    activeUsers7d: number;
    totalMaterials: number;
    publishedMaterials: number;
    pendingMaterials: number;
    totalDownloads: number;
    totalComments: number;
    recentActivity: ActivityEntry[];
}

export interface OnlineUser {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
    lastSeenAt: string;
}

export interface DailySeriesPoint {
    date: string;
    count: number;
}

export interface ActivityTypeCount {
    type: ActivityType;
    count: number;
}

export interface AdminAnalytics {
    registrationsSeries: DailySeriesPoint[];
    downloadsSeries: DailySeriesPoint[];
    activityBreakdown: ActivityTypeCount[];
    topMaterials: Material[];
}
