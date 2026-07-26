import { ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { Users, UsersDocument } from '@modules/users/entities/users.schema';
import { UserRole } from '@modules/users/user-role.enum';
import type { JwtPayload } from '@modules/auth/jwt-payload.interface';

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

    async delete(id: string): Promise<boolean> {
        const deletedUser = await this.usersModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException();
        }
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

    async countAll(): Promise<number> {
        return this.usersModel.countDocuments().exec();
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
