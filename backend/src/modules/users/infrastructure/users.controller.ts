import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { UpdateProfileDto } from '@modules/users/application/dto/update-profile.dto';
import { UpdateUserRoleDto } from '@modules/users/application/dto/update-user-role.dto';
import { UpdateUserBanDto } from '@modules/users/application/dto/update-user-ban.dto';
import { UsersService } from '@modules/users/application/users.service';
import { UserRole } from '@modules/users/domain/user.interface';
import { JwtAccessGuard } from '@modules/auth/infrastructure/guards/jwt-access.guard';
import { RolesGuard } from '@modules/auth/infrastructure/guards/roles.guard';
import { Roles } from '@modules/auth/infrastructure/decorators/roles.decorator';
import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';
import type { JwtPayload } from '@modules/auth/domain/jwt.payload';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getProfile(user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAccessGuard)
  async updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAllPaginated(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateRole(@CurrentUser() admin: JwtPayload, @Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.usersService.updateRole(admin.sub, id, dto.role);
  }

  @Patch(':id/ban')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async setBanned(@CurrentUser() admin: JwtPayload, @Param('id') id: string, @Body() dto: UpdateUserBanDto) {
    return this.usersService.setBanned(admin.sub, id, dto.isBanned);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@CurrentUser() admin: JwtPayload, @Param('id') id: string) {
    await this.usersService.remove(admin.sub, id);
    return { success: true };
  }
}
