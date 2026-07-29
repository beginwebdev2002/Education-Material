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
    MATERIAL_DELETE: 'material-delete',
    COMMENT_DELETE: 'comment-delete',
    ACCOUNT_DELETE: 'account-delete',
};

/** Returns a translate key for an activity type, e.g. 'admin.activityTypes.MATERIAL_UPLOAD'. */
export function activityLabel(type: string): string {
    return `admin.activityTypes.${type}`;
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

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatBytes(bytes: number): string {
    if (bytes <= 0) return '0 B';
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1);
    const value = bytes / Math.pow(1024, exponent);
    return `${value.toFixed(exponent === 0 ? 0 : 1)} ${BYTE_UNITS[exponent]}`;
}
