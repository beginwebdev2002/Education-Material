import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '@features/users/application/dto/update-user.dto';
import { FindAllUsersUseCase } from '@features/users/application/use-cases/find-all-users.use-case';
import { FindOneUserUseCase } from '@features/users/application/use-cases/find-one-user.use-case';
import { UpdateUserUseCase } from '@features/users/application/use-cases/update-user.use-case';
import { RemoveUserUseCase } from '@features/users/application/use-cases/remove-user.use-case';
import { GetProfileUseCase } from '@features/users/application/use-cases/get-profile.use-case';
import { UserRole } from '@features/users/domain/user.interface';
import type { JwtPayload } from '@features/auth/domain/jwt.payload';
import { Roles, RolesGuard } from '@common';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) { }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Get the authenticated user's own profile" })
  async getProfile(@Req() req: Request) {
    const payload = req.user as JwtPayload;
    return await this.getProfileUseCase.execute(payload);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List users (admin only)' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.findAllUsersUseCase.execute(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a user profile by id' })
  findOne(@Param('id') id: string) {
    return this.findOneUserUseCase.execute(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a user (self, or admin for any user / role changes)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.updateUserUseCase.execute(id, updateUserDto, req.user as JwtPayload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  remove(@Param('id') id: string) {
    return this.removeUserUseCase.execute(id);
  }
}
