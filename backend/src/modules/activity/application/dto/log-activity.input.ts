import { ActivityType } from '@modules/activity/domain/activity.interface';

export interface LogActivityInput {
    userId: string;
    type: ActivityType;
    materialId?: string;
    metadata?: Record<string, unknown>;
    ip?: string;
    userAgent?: string;
}
