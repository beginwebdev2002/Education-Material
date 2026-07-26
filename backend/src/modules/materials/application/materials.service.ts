import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { MaterialsRepository } from '@modules/materials/infrastructure/materials.repository';
import { MaterialFormat, MaterialStatus, MATERIAL_ALLOWED_MIME_TYPES } from '@modules/materials/domain/material.interface';
import { UploadedMulterFile } from '@modules/materials/infrastructure/uploaded-file.type';
import { CreateMaterialDto } from './dto/create-material.dto';
import { ActivityService } from '@modules/activity/application/activity.service';
import { ActivityType } from '@modules/activity/domain/activity.interface';
import { UserRole } from '@modules/users/user-role.enum';
import { UsersService } from '@modules/users/users.service';
import { JwtPayload } from '@modules/auth/jwt-payload.interface';
import { RequestMeta } from '@common/interfaces/request-meta.interface';

@Injectable()
export class MaterialsService {
    constructor(
        private readonly materialsRepository: MaterialsRepository,
        private readonly activityService: ActivityService,
        private readonly usersService: UsersService,
        private readonly config: ConfigService,
    ) { }

    async upload(ownerId: string, dto: CreateMaterialDto, file: UploadedMulterFile | undefined, meta: RequestMeta) {
        if (!file) {
            throw new BadRequestException('A PDF or DOCX file is required');
        }

        const format: MaterialFormat = MATERIAL_ALLOWED_MIME_TYPES[file.mimetype];
        const material = await this.materialsRepository.create({
            ...dto,
            owner: ownerId,
            format,
            originalName: file.originalname,
            storedFileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
        });

        await this.activityService.log({
            userId: ownerId,
            type: ActivityType.MATERIAL_UPLOAD,
            materialId: material.id as string,
            ip: meta.ip,
            userAgent: meta.userAgent,
        });

        return material;
    }

    async listPublished(params: { search?: string; sortBy?: 'downloads' | 'date'; page: number; limit: number }) {
        return this.materialsRepository.findPublished(params);
    }

    async listMine(ownerId: string, page: number, limit: number) {
        return this.materialsRepository.findByOwner(ownerId, page, limit);
    }

    async listForAdmin(params: { search?: string; status?: MaterialStatus; page: number; limit: number }) {
        return this.materialsRepository.findAllPaginated(params);
    }

    private async isAdmin(requester: JwtPayload): Promise<boolean> {
        const user = await this.usersService.findById(requester._id);
        return user?.role === UserRole.ADMIN;
    }

    async prepareDownload(id: string, requester: JwtPayload, meta: RequestMeta) {
        const material = await this.materialsRepository.findById(id);
        if (!material) {
            throw new NotFoundException('Material not found');
        }

        const isOwner = material.owner.toString() === requester._id;
        if (material.status !== MaterialStatus.PUBLISHED && !isOwner && !(await this.isAdmin(requester))) {
            throw new ForbiddenException('This material is not available for download');
        }

        await this.materialsRepository.incrementDownloads(id);
        await this.activityService.log({
            userId: requester._id,
            type: ActivityType.MATERIAL_DOWNLOAD,
            materialId: id,
            ip: meta.ip,
            userAgent: meta.userAgent,
        });

        return material;
    }

    resolveFilePath(storedFileName: string): string {
        return join(this.config.get<string>('uploads.materialsDir')!, storedFileName);
    }

    async remove(id: string, requester: JwtPayload) {
        const material = await this.materialsRepository.findById(id);
        if (!material) {
            throw new NotFoundException('Material not found');
        }

        const isOwner = material.owner.toString() === requester._id;
        if (!isOwner && !(await this.isAdmin(requester))) {
            throw new ForbiddenException('You cannot delete this material');
        }

        await this.materialsRepository.deleteById(id);
        await unlink(this.resolveFilePath(material.storedFileName)).catch(() => undefined);
    }

    async updateStatus(id: string, status: MaterialStatus, admin: JwtPayload) {
        const updated = await this.materialsRepository.updateStatus(id, status);
        if (!updated) {
            throw new NotFoundException('Material not found');
        }

        await this.activityService.log({
            userId: admin._id,
            type: ActivityType.MATERIAL_STATUS_CHANGE,
            materialId: id,
            metadata: { status },
        });

        return updated;
    }
}
