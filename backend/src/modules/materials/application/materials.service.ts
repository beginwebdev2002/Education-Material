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
import { UserRole } from '@modules/users/domain/user.interface';
import { JwtPayload } from '@modules/auth/domain/jwt.payload';
import { RequestMeta } from '@modules/auth/application/auth.service';

@Injectable()
export class MaterialsService {
    constructor(
        private readonly materialsRepository: MaterialsRepository,
        private readonly activityService: ActivityService,
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

    async prepareDownload(id: string, requester: JwtPayload, meta: RequestMeta) {
        const material = await this.materialsRepository.findById(id);
        if (!material) {
            throw new NotFoundException('Material not found');
        }

        const isOwner = material.owner.toString() === requester.sub;
        const isAdmin = requester.role === UserRole.ADMIN;
        if (material.status !== MaterialStatus.PUBLISHED && !isOwner && !isAdmin) {
            throw new ForbiddenException('This material is not available for download');
        }

        await this.materialsRepository.incrementDownloads(id);
        await this.activityService.log({
            userId: requester.sub,
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

        const isOwner = material.owner.toString() === requester.sub;
        if (!isOwner && requester.role !== UserRole.ADMIN) {
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
            userId: admin.sub,
            type: ActivityType.MATERIAL_STATUS_CHANGE,
            materialId: id,
            metadata: { status },
        });

        return updated;
    }
}
