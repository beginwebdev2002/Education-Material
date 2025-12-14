import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import type { Request, Response } from 'express';
import { Model } from 'mongoose';
import { UpdateUserDto } from '@modules/users/application/dto/update-user.dto';
import { Users } from '@modules/users/domain/users.schema';
import { UsersRepository } from '@modules/users/infrastructure/users.repository';
import { JwtPayload } from '@modules/auth/domain/jwt.payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
    private usersRepository: UsersRepository,
  ) { }



  async findAll() {
    return this.usersRepository.findAll();
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
  async getProfile(payload: JwtPayload) {
    return await this.usersRepository.findById(payload._id);
  }
}
