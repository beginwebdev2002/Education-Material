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

    async findAll(page = 1, limit = 20): Promise<PaginatedUsers> {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.usersModel.find().select('-password').skip(skip).limit(limit).exec(),
            this.usersModel.countDocuments().exec(),
        ]);
        return { items, total, page, limit };
    }

    async getProfile(payload: JwtPayload): Promise<UsersDocument | null> {
        return this.findById(payload._id);
    }
}
