import { Controller, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AdminService } from '@modules/admin/application/admin.service';
import { JwtAccessGuard } from '@modules/auth/infrastructure/guards/jwt-access.guard';
import { RolesGuard } from '@modules/auth/infrastructure/guards/roles.guard';
import { Roles } from '@modules/auth/infrastructure/decorators/roles.decorator';
import { UserRole } from '@modules/users/domain/user.interface';
import { ActivityType } from '@modules/activity/domain/activity.interface';

@Controller('admin')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('overview')
    async overview() {
        return this.adminService.overview();
    }

    @Get('online-users')
    async onlineUsers() {
        return this.adminService.onlineUsers();
    }

    @Get('analytics')
    async analytics(@Query('days', new ParseIntPipe({ optional: true })) days = 30) {
        return this.adminService.analytics(days);
    }

    @Get('activity')
    async activityLog(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
        @Query('type') type?: ActivityType,
    ) {
        return this.adminService.activityLog(page, limit, type);
    }
}
