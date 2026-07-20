import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "@features/users/application/dto/create-user.dto";
import { IUserRepository, PaginatedUsers } from "@features/users/application/ports/outbound/users-repository.port";
import { Users, UsersDocument } from "@features/users/adapters/outbound/mongoose/users.schema";

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
    async delete(id: string): Promise<boolean> {
        const deletedUser = await this.usersModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException();
        }
        return true;
    }
    // Deliberately includes the password hash — the only consumer is
    // the auth feature's signin use case, which needs it for bcrypt.compare().
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
}
