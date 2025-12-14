import { CreateUserDto } from '@modules/users/application/dto/create-user.dto';
import { LoginUserDto } from '@modules/users/application/dto/login-user.dto';
import { UpdateUserDto } from '@modules/users/application/dto/update-user.dto';
import { Users } from '@modules/users/domain/users.schema';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { Model } from 'mongoose';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
    private usersRepository: UsersRepository,
    private config: ConfigService,
    private jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto, res: Response) {
    const { saltRounds } = this.config.get('bcrypt');
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(createUserDto.password, salt);
    const result = await this.usersRepository.create({ ...createUserDto, password: hash });
    const payload = { _id: result.id, email: result.email };
    const accessToken = await this.jwtService.signAsync(payload);
    this.setCookieToken(res, accessToken);
    return {
      accessToken,
      ...result.toObject()
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersRepository.findByEmail(loginUserDto.email);
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }
    const payload = { _id: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      ...user.toObject()
    };
  }

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
  async me(request: Request) {
    // const accessToken = request.cookies
    console.log('Me: ', JSON.stringify(request.cookies));

    return await this.usersModel.findOne().exec();
  }
  private setCookieToken(res: Response, token: string) {
    res.cookie('token', token, {
      httpOnly: this.config.get('cookies.httpOnly'),
      secure: this.config.get('cookies.secure'),
      sameSite: this.config.get('cookies.sameSite'),
      maxAge: this.config.get('cookies.maxAge')
    });
  }

  private parseCookieToken(req: Request): string {
    const token: string = req.cookies.token;
    if (!token) {
      throw new UnauthorizedException();
    }

    const user = this.jwtService.verify(token);
    return user;
  }

}
