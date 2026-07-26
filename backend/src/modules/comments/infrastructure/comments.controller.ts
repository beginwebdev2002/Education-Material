import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { CommentsService } from '@modules/comments/application/comments.service';
import { CreateCommentDto } from '@modules/comments/application/dto/create-comment.dto';
import { JwtAccessGuard } from '@modules/auth/infrastructure/guards/jwt-access.guard';
import { RolesGuard } from '@modules/auth/infrastructure/guards/roles.guard';
import { Roles } from '@modules/auth/infrastructure/decorators/roles.decorator';
import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';
import type { JwtPayload } from '@modules/auth/domain/jwt.payload';
import { UserRole } from '@modules/users/domain/user.interface';

function requestMeta(req: Request) {
    return { ip: req.ip, userAgent: req.headers['user-agent'] as string | undefined };
}

@Controller()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Get('materials/:materialId/comments')
    async list(
        @Param('materialId') materialId: string,
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    ) {
        return this.commentsService.listForMaterial(materialId, page, limit);
    }

    @Post('materials/:materialId/comments')
    @UseGuards(JwtAccessGuard)
    async create(
        @CurrentUser() user: JwtPayload,
        @Param('materialId') materialId: string,
        @Body() dto: CreateCommentDto,
        @Req() req: Request,
    ) {
        return this.commentsService.create(materialId, user, dto.text, requestMeta(req));
    }

    @Get('comments/admin/all')
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async adminList(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    ) {
        return this.commentsService.listAllForAdmin(page, limit);
    }

    @Delete('comments/:id')
    @UseGuards(JwtAccessGuard)
    async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        await this.commentsService.remove(id, user);
        return { success: true };
    }
}
