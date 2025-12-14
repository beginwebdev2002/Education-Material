import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { Users } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
    private config: ConfigService,
    private jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto, res: Response) {
    const { saltRounds } = this.config.get('bcrypt');
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(createUserDto.password, salt);
    const result = await new this.usersModel({ ...createUserDto, password: hash }).save();
    const payload = { _id: result.id, email: result.email };
    const accessToken = await this.jwtService.signAsync(payload);
    this.setCookie(res, accessToken);

    console.log('Res: ', result.toObject());

    return {
      accessToken,
      ...result.toObject()
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersModel.findOne({ email: loginUserDto.email }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }
    const payload = { _id: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      ...user.toObject()
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
  async me(request: Request) {
    const accessToken = request.cookies
    return await this.usersModel.findOne().exec();
  }
  private setCookie(res: Response, token: string) {
    res.cookie('token', token, {
      httpOnly: this.config.get('cookies.httpOnly'),
      secure: this.config.get('cookies.secure'),
      sameSite: this.config.get('cookies.sameSite'),
      maxAge: this.config.get('cookies.maxAge')
    });
  }
}
