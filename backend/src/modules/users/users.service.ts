import { ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { Users, UsersDocument } from '@modules/users/entities/users.schema';
import { UserRole } from '@modules/users/user-role.enum';
import type { JwtPayload } from '@modules/auth/jwt-payload.interface';
import { ActivityService } from '@modules/activity/activity.service';
import { ActivityType } from '@modules/activity/activity.interface';
import { RequestMeta } from '@common/interfaces/request-meta.interface';

export interface PaginatedUsers {
    items: UsersDocument[];
    total: number;
    page: number;
    limit: number;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Users.name) private readonly usersModel: Model<UsersDocument>,
        private readonly configService: ConfigService,
        private readonly activityService: ActivityService,
    ) { }

    async create(userData: CreateUserDto): Promise<UsersDocument> {
        try {
            const createdUser = new this.usersModel(userData);
            return createdUser.save();
        } catch (e) {
            throw new UnprocessableEntityException();
        }
    }

    async findById(id: string): Promise<UsersDocument | null> {
        const existUser = await this.usersModel.findById(id).select('-password').exec();
        if (!existUser) {
            throw new NotFoundException();
        }
        return existUser;
    }

    async update(id: string, updateData: Partial<Users>): Promise<UsersDocument | null> {
        return this.usersModel
            .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .select('-password')
            .exec();
    }

    async updateAvatar(id: string, storedFileName: string, meta: RequestMeta = {}): Promise<UsersDocument | null> {
        const publicUrl = this.configService.get<string>('app.publicUrl');
        const avatar = `${publicUrl}/uploads/avatars/${storedFileName}`;
        const updated = await this.update(id, { avatar });
        await this.activityService.log({ userId: id, type: ActivityType.PROFILE_UPDATE, ip: meta.ip, userAgent: meta.userAgent });
        return updated;
    }

    async updateOwnProfile(id: string, updateUserDto: UpdateUserDto, requester: JwtPayload, meta: RequestMeta = {}): Promise<UsersDocument | null> {
        const updated = await this.updateAsUser(id, updateUserDto, requester);
        await this.activityService.log({ userId: id, type: ActivityType.PROFILE_UPDATE, ip: meta.ip, userAgent: meta.userAgent });
        return updated;
    }

    async updateAsUser(id: string, updateUserDto: UpdateUserDto, requester: JwtPayload): Promise<UsersDocument | null> {
        const requesterUser = await this.findById(requester._id);
        const isAdmin = requesterUser?.role === UserRole.ADMIN;
        const isSelf = requester._id === id;

        if (!isAdmin && !isSelf) {
            throw new ForbiddenException('You may only update your own profile.');
        }
        if (!isAdmin && updateUserDto.role !== undefined) {
            throw new ForbiddenException('Only an admin can change a user role.');
        }
        if (!isAdmin && updateUserDto.isBanned !== undefined) {
            throw new ForbiddenException('Only an admin can ban or unban a user.');
        }

        return this.update(id, updateUserDto);
    }

    async delete(id: string, deletedBy?: string, meta: RequestMeta = {}): Promise<boolean> {
        const deletedUser = await this.usersModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException();
        }
        await this.activityService.log({
            userId: id,
            type: ActivityType.ACCOUNT_DELETE,
            metadata: deletedBy ? { deletedBy } : undefined,
            ip: meta.ip,
            userAgent: meta.userAgent,
        });
        return true;
    }

    // Deliberately includes the password hash — the only consumer is
    // the auth module's signin flow, which needs it for bcrypt.compare().
    async findByEmail(email: string): Promise<UsersDocument | null> {
        return this.usersModel.findOne({ email }).exec();
    }

    async findAll(page = 1, limit = 20, search?: string): Promise<PaginatedUsers> {
        const skip = (page - 1) * limit;
        const filter: Record<string, unknown> = search
            ? {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
            }
            : {};
        const [items, total] = await Promise.all([
            this.usersModel.find(filter).select('-password').skip(skip).limit(limit).exec(),
            this.usersModel.countDocuments(filter).exec(),
        ]);
        return { items, total, page, limit };
    }

    async getProfile(payload: JwtPayload): Promise<UsersDocument | null> {
        return this.findById(payload._id);
    }

    async findIdsBySearch(search: string): Promise<string[]> {
        const matches = await this.usersModel
            .find({
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
            })
            .select('_id')
            .exec();
        return matches.map((user) => user._id.toString());
    }

    async countAll(): Promise<number> {
        return this.usersModel.countDocuments().exec();
    }

    async touchLastSeen(id: string): Promise<void> {
        await this.usersModel.updateOne({ _id: id }, { lastSeenAt: new Date() }).exec();
    }

    async countByRole(): Promise<{ role: UserRole; count: number }[]> {
        const rows = await this.usersModel.aggregate<{ _id: UserRole; count: number }>([
            { $group: { _id: '$role', count: { $sum: 1 } } },
        ]);
        return rows.map((row) => ({ role: row._id, count: row.count }));
    }

    async topContributors(limit: number): Promise<{ user: UsersDocument; uploadsCount: number }[]> {
        const rows = await this.usersModel.aggregate<{ _id: string; uploadsCount: number }>([
            {
                $lookup: {
                    from: 'materials',
                    localField: '_id',
                    foreignField: 'owner',
                    as: 'materials',
                },
            },
            { $project: { uploadsCount: { $size: '$materials' } } },
            { $match: { uploadsCount: { $gt: 0 } } },
            { $sort: { uploadsCount: -1 } },
            { $limit: limit },
        ]);

        const users = await this.usersModel.find({ _id: { $in: rows.map((row) => row._id) } }).select('-password').exec();
        const userById = new Map(users.map((user) => [user.id as string, user]));

        const contributors: { user: UsersDocument; uploadsCount: number }[] = [];
        for (const row of rows) {
            const user = userById.get(row._id);
            if (user) {
                contributors.push({ user, uploadsCount: row.uploadsCount });
            }
        }
        return contributors;
    }

    async countOnlineSince(sinceDate: Date): Promise<number> {
        return this.usersModel.countDocuments({ lastSeenAt: { $gte: sinceDate } }).exec();
    }

    async countActiveSince(sinceDate: Date): Promise<number> {
        return this.usersModel.countDocuments({ lastSeenAt: { $gte: sinceDate } }).exec();
    }

    async findOnlineSince(sinceDate: Date, limit: number): Promise<UsersDocument[]> {
        return this.usersModel
            .find({ lastSeenAt: { $gte: sinceDate } })
            .select('-password')
            .sort({ lastSeenAt: -1 })
            .limit(limit)
            .exec();
    }

    async registrationsSeriesSince(sinceDate: Date): Promise<{ date: string; count: number }[]> {
        const rows = await this.usersModel.aggregate<{ _id: string; count: number }>([
            { $match: { createdAt: { $gte: sinceDate } } },
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
}
