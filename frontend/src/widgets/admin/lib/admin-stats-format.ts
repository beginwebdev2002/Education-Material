import { ActivityType } from '../model/admin-stats.model';

/** Fixed hue order for the small, closed set of activity types — never cycled or reassigned by rank. BEM modifier keywords; see analytics.component.scss for the color mapping. */
export const ACTIVITY_TYPE_MODIFIERS: Record<ActivityType, string> = {
    REGISTER: 'register',
    LOGIN: 'login',
    LOGOUT: 'logout',
    PROFILE_UPDATE: 'profile-update',
    MATERIAL_UPLOAD: 'material-upload',
    MATERIAL_DOWNLOAD: 'material-download',
    MATERIAL_COMMENT: 'material-comment',
    MATERIAL_STATUS_CHANGE: 'material-status-change',
};

export function activityLabel(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase();
}

export function toBars<T extends { count: number }>(series: T[]): (T & { heightPercent: number })[] {
    const max = Math.max(...series.map((point) => point.count), 1);
    return series.map((point) => ({
        ...point,
        heightPercent: Math.max(Math.round((point.count / max) * 100), point.count > 0 ? 6 : 0),
    }));
}

export function barWidth(count: number, max: number): number {
    return max > 0 ? Math.round((count / max) * 100) : 0;
}
