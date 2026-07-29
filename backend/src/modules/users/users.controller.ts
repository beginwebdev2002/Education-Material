import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { UsersService } from '@modules/users/users.service';
import { UserRole } from '@modules/users/user-role.enum';
import type { JwtPayload } from '@modules/auth/jwt-payload.interface';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';

function requestMeta(req: Request) {
  return { ip: req.ip, userAgent: req.headers['user-agent'] as string | undefined };
}

interface UploadedAvatarFile {
  filename: string;
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Get the authenticated user's own profile" })
  async getProfile(@Req() req: Request) {
    const payload = req.user as JwtPayload;
    return await this.usersService.getProfile(payload);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Update the authenticated user's own profile" })
  updateProfile(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const payload = req.user as JwtPayload;
    return this.usersService.updateOwnProfile(payload._id, updateUserDto, payload, requestMeta(req));
  }

  @Post('me/avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: "Upload the authenticated user's own avatar image" })
  async uploadAvatar(@UploadedFile() file: UploadedAvatarFile, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('No avatar file was provided');
    }
    const payload = req.user as JwtPayload;
    return this.usersService.updateAvatar(payload._id, file.filename, requestMeta(req));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List users (admin only)' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(page, limit, search);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a user profile by id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a user (self, or admin for any user / role changes)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.usersService.updateAsUser(id, updateUserDto, req.user as JwtPayload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const admin = req.user as JwtPayload;
    return this.usersService.delete(id, admin._id, requestMeta(req));
  }
}
