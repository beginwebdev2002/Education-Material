import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "@modules/users/application/dto/create-user.dto";
import { IUserRepository } from "@modules/users/domain/users.repository.interface";
import { Users } from "@modules/users/domain/users.schema";

@Injectable()
export class UsersRepository implements IUserRepository {
    constructor(
        @InjectModel(Users.name) private readonly usersModel: Model<Users>,
    ) { }
    async create(userData: CreateUserDto): Promise<Users> {
        try {
            const createdUser = new this.usersModel(userData);
            return createdUser.save();
        } catch (e) {
            throw new UnprocessableEntityException();
        }

    }
    async findById(id: string): Promise<Users | null> {
        const existUser = await this.usersModel.findById(id).exec();
        if (!existUser) {
            throw new NotFoundException();
        }
        return existUser;
    }
    async update(id: string, updateData: Partial<Users>): Promise<Users | null> {
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
    async findByEmail(email: string): Promise<Users | null> {
        return this.usersModel.findOne({ email }).exec();
    }
}