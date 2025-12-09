import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { Users } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>
  ) { }

  async create(createUserDto: CreateUserDto) {
    console.log("test");
    const createdUser = new this.usersModel(createUserDto);
    return await createdUser.save();
  }

  async findAll() {
    return await this.usersModel.find().exec();
  }

  async findOne(id: string) {
    return await this.usersModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string) {
    return await this.usersModel.findByIdAndDelete(id).exec();
  }
}
