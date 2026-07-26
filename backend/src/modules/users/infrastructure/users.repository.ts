import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "@modules/users/application/dto/create-user.dto";
import { IUserRepository, PaginatedResult } from "@modules/users/domain/users.repository.interface";
import { Users, UsersDocument } from "@modules/users/domain/users.schema";
import { UserRole } from "@modules/users/domain/user.interface";

@Injectable()
export class UsersRepository implements IUserRepository {
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
        const existUser = await this.usersModel.findById(id).exec();
        if (!existUser) {
            throw new NotFoundException();
        }
        return existUser;
    }
    async update(id: string, updateData: Partial<Users>): Promise<UsersDocument | null> {
        return this.usersModel
            .findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
    async delete(id: string): Promise<boolean> {
        const deletedUser = await this.usersModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException();
        }
        return true;
    }
    async findByEmail(email: string): Promise<UsersDocument | null> {
        return this.usersModel.findOne({ email }).exec();
    }

    async findAll(): Promise<UsersDocument[]> {
        return this.usersModel.find().exec();
    }

    async findAllPaginated(params: { search?: string; page: number; limit: number }): Promise<PaginatedResult<UsersDocument>> {
        const { search, page, limit } = params;
        const filter = search
            ? {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const [items, total] = await Promise.all([
            this.usersModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.usersModel.countDocuments(filter).exec(),
        ]);

        return { items, total, page, limit };
    }

    async touchLastSeen(id: string): Promise<void> {
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        await this.usersModel.updateOne(
            {
                _id: id,
                $or: [{ lastSeenAt: null }, { lastSeenAt: { $lt: oneMinuteAgo } }],
            },
            { $set: { lastSeenAt: new Date() } },
        ).exec();
    }

    async setRole(id: string, role: UserRole): Promise<UsersDocument | null> {
        return this.usersModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
    }

    async setBanned(id: string, isBanned: boolean): Promise<UsersDocument | null> {
        return this.usersModel.findByIdAndUpdate(id, { isBanned }, { new: true }).exec();
    }

    async countAll(): Promise<number> {
        return this.usersModel.countDocuments().exec();
    }

    async countActiveSince(date: Date): Promise<number> {
        return this.usersModel.countDocuments({ lastSeenAt: { $gte: date } }).exec();
    }

    async countOnlineSince(date: Date): Promise<number> {
        return this.usersModel.countDocuments({ lastSeenAt: { $gte: date } }).exec();
    }

    async findOnlineSince(date: Date, limit: number): Promise<UsersDocument[]> {
        return this.usersModel
            .find({ lastSeenAt: { $gte: date } })
            .sort({ lastSeenAt: -1 })
            .limit(limit)
            .exec();
    }

    async registrationsSeriesSince(date: Date): Promise<{ date: string; count: number }[]> {
        const rows = await this.usersModel.aggregate<{ _id: string; count: number }>([
            { $match: { createdAt: { $gte: date } } },
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
