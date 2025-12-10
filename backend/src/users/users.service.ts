import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { Users } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
    private config: ConfigService,
    private jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { saltRounds } = this.config.get('bcrypt');
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(createUserDto.password, salt);
    const result = await new this.usersModel({ ...createUserDto, password: hash }).save();
    const payload = { sub: result.id, username: result.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      ...result.toObject()
    };
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
