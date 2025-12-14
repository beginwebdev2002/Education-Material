import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { CreateUserDto } from '@modules/users/application/dto/create-user.dto';
import { LoginUserDto } from '@modules/users/application/dto/login-user.dto';
import { UpdateUserDto } from '@modules/users/application/dto/update-user.dto';
import { UsersService } from '@modules/users/application/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: Request) {
    const payload = req.user;
    return await this.usersService.getProfile(payload);
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
