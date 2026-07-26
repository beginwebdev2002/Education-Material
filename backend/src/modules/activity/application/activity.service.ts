import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from '@modules/activity/domain/activity.schema';
import { ActivityType } from '@modules/activity/domain/activity.interface';
import { LogActivityInput } from './dto/log-activity.input';
import { PaginatedResult } from '@modules/users/domain/users.repository.interface';

export interface ActivityTypeCount {
    type: ActivityType;
    count: number;
}

export interface DailySeriesPoint {
    date: string;
    count: number;
}

@Injectable()
export class ActivityService {
    private readonly logger = new Logger(ActivityService.name);

    constructor(
        @InjectModel(Activity.name) private readonly activityModel: Model<ActivityDocument>,
    ) { }

    async log(input: LogActivityInput): Promise<void> {
        try {
            await this.activityModel.create({
                user: new Types.ObjectId(input.userId),
                type: input.type,
                material: input.materialId ? new Types.ObjectId(input.materialId) : undefined,
                metadata: input.metadata,
                ip: input.ip,
                userAgent: input.userAgent,
            });
        } catch (error) {
            this.logger.error(`Failed to log activity: ${input.type}`, error as Error);
        }
    }

    async findRecent(limit = 20) {
        return this.activityModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('user', 'firstName lastName avatar email role')
            .populate('material', 'title')
            .exec();
    }

    async findPaginated(params: { page: number; limit: number; type?: ActivityType }): Promise<PaginatedResult<ActivityDocument>> {
        const { page, limit, type } = params;
        const filter = type ? { type } : {};

        const [items, total] = await Promise.all([
            this.activityModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('user', 'firstName lastName avatar email role')
                .populate('material', 'title')
                .exec(),
            this.activityModel.countDocuments(filter).exec(),
        ]);

        return { items, total, page, limit };
    }

    async activityBreakdownSince(sinceDate: Date): Promise<ActivityTypeCount[]> {
        const rows = await this.activityModel.aggregate<{ _id: ActivityType; count: number }>([
            { $match: { createdAt: { $gte: sinceDate } } },
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        return rows.map((row) => ({ type: row._id, count: row.count }));
    }

    async dailySeriesSince(type: ActivityType, sinceDate: Date): Promise<DailySeriesPoint[]> {
        const rows = await this.activityModel.aggregate<{ _id: string; count: number }>([
            { $match: { type, createdAt: { $gte: sinceDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return rows.map((row) => ({ date: row._id, count: row.count }));
    }

    async countSince(type: ActivityType, sinceDate: Date): Promise<number> {
        return this.activityModel.countDocuments({ type, createdAt: { $gte: sinceDate } }).exec();
    }

    async countAll(): Promise<number> {
        return this.activityModel.countDocuments().exec();
    }
}
