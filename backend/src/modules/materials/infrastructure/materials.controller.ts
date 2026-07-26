import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';

import { MaterialsService } from '@modules/materials/application/materials.service';
import { CreateMaterialDto } from '@modules/materials/application/dto/create-material.dto';
import { UpdateMaterialStatusDto } from '@modules/materials/application/dto/update-material-status.dto';
import type { UploadedMulterFile } from './uploaded-file.type';
import { MaterialStatus } from '@modules/materials/domain/material.interface';
import { JwtAccessGuard } from '@modules/auth/infrastructure/guards/jwt-access.guard';
import { RolesGuard } from '@modules/auth/infrastructure/guards/roles.guard';
import { Roles } from '@modules/auth/infrastructure/decorators/roles.decorator';
import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';
import type { JwtPayload } from '@modules/auth/domain/jwt.payload';
import { UserRole } from '@modules/users/domain/user.interface';

function requestMeta(req: Request) {
    return { ip: req.ip, userAgent: req.headers['user-agent'] as string | undefined };
}

@Controller('materials')
export class MaterialsController {
    constructor(private readonly materialsService: MaterialsService) { }

    @Post()
    @UseGuards(JwtAccessGuard)
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @CurrentUser() user: JwtPayload,
        @Body() dto: CreateMaterialDto,
        @UploadedFile() file: UploadedMulterFile,
        @Req() req: Request,
    ) {
        return this.materialsService.upload(user.sub, dto, file, requestMeta(req));
    }

    @Get()
    async list(
        @Query('search') search?: string,
        @Query('sortBy') sortBy?: 'downloads' | 'date',
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 12,
    ) {
        return this.materialsService.listPublished({ search, sortBy, page, limit });
    }

    @Get('mine')
    @UseGuards(JwtAccessGuard)
    async mine(
        @CurrentUser() user: JwtPayload,
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    ) {
        return this.materialsService.listMine(user.sub, page, limit);
    }

    @Get('admin')
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async adminList(
        @Query('search') search?: string,
        @Query('status') status?: MaterialStatus,
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    ) {
        return this.materialsService.listForAdmin({ search, status, page, limit });
    }

    @Get(':id/download')
    @UseGuards(JwtAccessGuard)
    async download(
        @Param('id') id: string,
        @CurrentUser() user: JwtPayload,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const material = await this.materialsService.prepareDownload(id, user, requestMeta(req));
        return res.download(this.materialsService.resolveFilePath(material.storedFileName), material.originalName);
    }

    @Delete(':id')
    @UseGuards(JwtAccessGuard)
    async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        await this.materialsService.remove(id, user);
        return { success: true };
    }

    @Patch(':id/status')
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateStatus(
        @CurrentUser() admin: JwtPayload,
        @Param('id') id: string,
        @Body() dto: UpdateMaterialStatusDto,
    ) {
        return this.materialsService.updateStatus(id, dto.status, admin);
    }
}
