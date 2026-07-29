import { Material } from '@entities/material';

export type ActivityType =
    | 'REGISTER'
    | 'LOGIN'
    | 'LOGOUT'
    | 'PROFILE_UPDATE'
    | 'MATERIAL_UPLOAD'
    | 'MATERIAL_DOWNLOAD'
    | 'MATERIAL_COMMENT'
    | 'MATERIAL_STATUS_CHANGE'
    | 'MATERIAL_DELETE'
    | 'COMMENT_DELETE'
    | 'ACCOUNT_DELETE';

export type AnalyticsCategory = ActivityType | 'ALL' | 'ACTIVE_USERS';

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

export interface UserRoleCount {
    role: string;
    count: number;
}

export interface TopContributor {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
    uploadsCount: number;
}

export interface AdminOverview {
    totalUsers: number;
    onlineUsersCount: number;
    activeUsers7d: number;
    totalMaterials: number;
    publishedMaterials: number;
    pendingMaterials: number;
    rejectedMaterials: number;
    rejectionRate: number;
    totalDownloads: number;
    totalComments: number;
    recentActivity: ActivityEntry[];
    usersByRole: UserRoleCount[];
    storageBytes: number;
    topContributors: TopContributor[];
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
    categorySeries: DailySeriesPoint[];
    category: AnalyticsCategory;
    activityBreakdown: ActivityTypeCount[];
    topMaterials: Material[];
}
