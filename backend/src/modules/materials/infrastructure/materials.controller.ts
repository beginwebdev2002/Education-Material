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
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';

import { MaterialsService } from '@modules/materials/application/materials.service';
import { CreateMaterialDto } from '@modules/materials/application/dto/create-material.dto';
import { UpdateMaterialStatusDto } from '@modules/materials/application/dto/update-material-status.dto';
import type { UploadedMulterFile } from './uploaded-file.type';
import { MaterialStatus } from '@modules/materials/domain/material.interface';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@modules/auth/jwt-payload.interface';
import { UserRole } from '@modules/users/user-role.enum';

function requestMeta(req: Request) {
    return { ip: req.ip, userAgent: req.headers['user-agent'] as string | undefined };
}

@Controller('materials')
export class MaterialsController {
    constructor(private readonly materialsService: MaterialsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @Req() req: Request,
        @Body() dto: CreateMaterialDto,
        @UploadedFile() file: UploadedMulterFile,
    ) {
        const user = req.user as JwtPayload;
        return this.materialsService.upload(user._id, dto, file, requestMeta(req));
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
    @UseGuards(AuthGuard('jwt'))
    async mine(
        @Req() req: Request,
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    ) {
        const user = req.user as JwtPayload;
        return this.materialsService.listMine(user._id, page, limit);
    }

    @Get('admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    @UseGuards(AuthGuard('jwt'))
    async download(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const user = req.user as JwtPayload;
        const material = await this.materialsService.prepareDownload(id, user, requestMeta(req));
        return res.download(this.materialsService.resolveFilePath(material.storedFileName), material.originalName);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Req() req: Request, @Param('id') id: string) {
        const user = req.user as JwtPayload;
        await this.materialsService.remove(id, user);
        return { success: true };
    }

    @Patch(':id/status')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateStatus(
        @Req() req: Request,
        @Param('id') id: string,
        @Body() dto: UpdateMaterialStatusDto,
    ) {
        const admin = req.user as JwtPayload;
        return this.materialsService.updateStatus(id, dto.status, admin);
    }
}
