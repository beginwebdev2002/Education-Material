import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

import { CommentsService } from '@modules/comments/comments.service';
import { CreateCommentDto } from '@modules/comments/dto/create-comment.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@modules/auth/jwt-payload.interface';
import { UserRole } from '@modules/users/user-role.enum';

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
    @UseGuards(AuthGuard('jwt'))
    async create(
        @Param('materialId') materialId: string,
        @Body() dto: CreateCommentDto,
        @Req() req: Request,
    ) {
        const user = req.user as JwtPayload;
        return this.commentsService.create(materialId, user, dto.text, requestMeta(req));
    }

    @Get('comments/admin/all')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async adminList(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    ) {
        return this.commentsService.listAllForAdmin(page, limit);
    }

    @Delete('comments/:id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Req() req: Request, @Param('id') id: string) {
        const user = req.user as JwtPayload;
        await this.commentsService.remove(id, user);
        return { success: true };
    }
}
