import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { createWriteStream } from 'fs';
import { stat, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import archiver from 'archiver';

import { Material, MaterialDocument } from '@modules/materials/entities/material.schema';
import { MaterialCategory, MaterialFormat, MaterialStatus, MATERIAL_ALLOWED_MIME_TYPES } from '@modules/materials/material.interface';
import { UploadedMulterFile } from '@modules/materials/uploaded-file.type';
import { CreateMaterialDto } from '@modules/materials/dto/create-material.dto';
import { ActivityService } from '@modules/activity/activity.service';
import { ActivityType } from '@modules/activity/activity.interface';
import { UserRole } from '@modules/users/user-role.enum';
import { UsersService } from '@modules/users/users.service';
import { AutocompleteService } from '@modules/autocomplete/autocomplete.service';
import { JwtPayload } from '@modules/auth/jwt-payload.interface';
import { RequestMeta } from '@common/interfaces/request-meta.interface';
import { PaginatedResult } from '@common/interfaces/paginated-result.interface';

const OWNER_POPULATE = 'firstName lastName avatar email';
const ITEM_POPULATE = [
    { path: 'institution', select: 'translations metadata' },
    { path: 'subject', select: 'translations metadata' },
];

@Injectable()
export class MaterialsService {
    constructor(
        @InjectModel(Material.name) private readonly materialModel: Model<MaterialDocument>,
        private readonly activityService: ActivityService,
        private readonly usersService: UsersService,
        private readonly autocompleteService: AutocompleteService,
        private readonly config: ConfigService,
    ) { }

    async upload(ownerId: string, dto: CreateMaterialDto, files: UploadedMulterFile[] | undefined, meta: RequestMeta) {
        if (!files || files.length === 0) {
            throw new BadRequestException('At least one PDF or DOCX file is required');
        }

        await this.autocompleteService.validateInstitutionSubjectPair(dto.institution, dto.subject);

        const fileFields = files.length === 1
            ? this.buildSingleFileFields(files[0])
            : await this.buildZipFields(dto.title, files);

        const material = await this.materialModel.create({
            ...dto,
            ...fileFields,
            owner: new Types.ObjectId(ownerId),
        });
        await material.populate([{ path: 'owner', select: OWNER_POPULATE }, ...ITEM_POPULATE]);

        await this.activityService.log({
            userId: ownerId,
            type: ActivityType.MATERIAL_UPLOAD,
            materialId: material.id as string,
            ip: meta.ip,
            userAgent: meta.userAgent,
        });

        return material;
    }

    private buildSingleFileFields(file: UploadedMulterFile) {
        const format: MaterialFormat = MATERIAL_ALLOWED_MIME_TYPES[file.mimetype];
        return {
            format,
            originalName: file.originalname,
            storedFileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
        };
    }

    private async buildZipFields(title: string, files: UploadedMulterFile[]) {
        const zipFilename = `${randomUUID()}.zip`;
        const zipPath = this.resolveFilePath(zipFilename);

        await new Promise<void>((resolve, reject) => {
            const output = createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });
            output.on('close', () => resolve());
            output.on('error', reject);
            archive.on('error', reject);
            archive.pipe(output);
            for (const file of files) {
                archive.file(this.resolveFilePath(file.filename), { name: file.originalname });
            }
            void archive.finalize();
        });

        await Promise.all(files.map((file) => unlink(this.resolveFilePath(file.filename)).catch(() => undefined)));

        const { size } = await stat(zipPath);
        return {
            format: MaterialFormat.ZIP,
            originalName: `${title.trim() || 'material'}.zip`,
            storedFileName: zipFilename,
            mimeType: 'application/zip',
            size,
        };
    }

    async listPublished(params: { search?: string; sortBy?: 'downloads' | 'date'; category?: MaterialCategory | MaterialCategory[]; dateFrom?: string; dateTo?: string; page: number; limit: number }): Promise<PaginatedResult<MaterialDocument>> {
        const { search, sortBy, category, dateFrom, dateTo, page, limit } = params;
        const filter: Record<string, unknown> = { status: MaterialStatus.PUBLISHED };
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        this.applyCategoryFilter(filter, category);
        this.applyDateRangeFilter(filter, dateFrom, dateTo);

        const sort: Record<string, 1 | -1> = sortBy === 'downloads' ? { downloadsCount: -1 } : { createdAt: -1 };

        const [items, total] = await Promise.all([
            this.materialModel
                .find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate([{ path: 'owner', select: OWNER_POPULATE }, ...ITEM_POPULATE])
                .exec(),
            this.materialModel.countDocuments(filter).exec(),
        ]);

        return { items, total, page, limit };
    }

    async listMine(ownerId: string, page: number, limit: number): Promise<PaginatedResult<MaterialDocument>> {
        const filter = { owner: new Types.ObjectId(ownerId) };
        const [items, total] = await Promise.all([
            this.materialModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate(ITEM_POPULATE)
                .exec(),
            this.materialModel.countDocuments(filter).exec(),
        ]);
        return { items, total, page, limit };
    }

    async listForAdmin(params: { search?: string; status?: MaterialStatus; category?: MaterialCategory | MaterialCategory[]; page: number; limit: number }): Promise<PaginatedResult<MaterialDocument>> {
        const { search, status, category, page, limit } = params;
        const filter: Record<string, unknown> = {};
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
            ];
        }
        this.applyCategoryFilter(filter, category);

        const [items, total] = await Promise.all([
            this.materialModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate([{ path: 'owner', select: OWNER_POPULATE }, ...ITEM_POPULATE])
                .exec(),
            this.materialModel.countDocuments(filter).exec(),
        ]);
        return { items, total, page, limit };
    }

    private applyCategoryFilter(filter: Record<string, unknown>, category?: MaterialCategory | MaterialCategory[]) {
        if (category && (!Array.isArray(category) || category.length > 0)) {
            filter.category = { $in: Array.isArray(category) ? category : [category] };
        }
    }

    private applyDateRangeFilter(filter: Record<string, unknown>, dateFrom?: string, dateTo?: string) {
        if (!dateFrom && !dateTo) return;
        const createdAt: Record<string, Date> = {};
        if (dateFrom) createdAt.$gte = new Date(dateFrom);
        if (dateTo) createdAt.$lte = new Date(dateTo);
        filter.createdAt = createdAt;
    }

    async findById(id: string): Promise<MaterialDocument | null> {
        return this.materialModel.findById(id).exec();
    }

    async findByIdPopulated(id: string): Promise<MaterialDocument> {
        const material = await this.materialModel
            .findById(id)
            .populate([{ path: 'owner', select: OWNER_POPULATE }, ...ITEM_POPULATE])
            .exec();
        if (!material) {
            throw new NotFoundException('Material not found');
        }
        return material;
    }

    async incrementComments(id: string, delta: number): Promise<void> {
        await this.materialModel.updateOne({ _id: id }, { $inc: { commentsCount: delta } }).exec();
    }

    async countAll(): Promise<number> {
        return this.materialModel.countDocuments().exec();
    }

    async countByStatus(status: MaterialStatus): Promise<number> {
        return this.materialModel.countDocuments({ status }).exec();
    }

    async sumDownloads(): Promise<number> {
        const [row] = await this.materialModel.aggregate<{ total: number }>([
            { $group: { _id: null, total: { $sum: '$downloadsCount' } } },
        ]);
        return row?.total ?? 0;
    }

    async sumStorageBytes(): Promise<number> {
        const [row] = await this.materialModel.aggregate<{ total: number }>([
            { $group: { _id: null, total: { $sum: '$size' } } },
        ]);
        return row?.total ?? 0;
    }

    async topByDownloads(limit: number): Promise<MaterialDocument[]> {
        return this.materialModel
            .find({ status: MaterialStatus.PUBLISHED })
            .sort({ downloadsCount: -1 })
            .limit(limit)
            .populate([{ path: 'owner', select: OWNER_POPULATE }, ...ITEM_POPULATE])
            .exec();
    }

    private async isAdmin(requester: JwtPayload): Promise<boolean> {
        const user = await this.usersService.findById(requester._id);
        return user?.role === UserRole.ADMIN;
    }

    async prepareDownload(id: string, requester: JwtPayload, meta: RequestMeta) {
        const material = await this.findById(id);
        if (!material) {
            throw new NotFoundException('Material not found');
        }

        const isOwner = material.owner.toString() === requester._id;
        if (material.status !== MaterialStatus.PUBLISHED && !isOwner && !(await this.isAdmin(requester))) {
            throw new ForbiddenException('This material is not available for download');
        }

        await this.materialModel.updateOne({ _id: id }, { $inc: { downloadsCount: 1 } }).exec();
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

    async remove(id: string, requester: JwtPayload, meta: RequestMeta = {}) {
        const material = await this.findById(id);
        if (!material) {
            throw new NotFoundException('Material not found');
        }

        const isOwner = material.owner.toString() === requester._id;
        if (!isOwner && !(await this.isAdmin(requester))) {
            throw new ForbiddenException('You cannot delete this material');
        }

        await this.materialModel.findByIdAndDelete(id).exec();
        await unlink(this.resolveFilePath(material.storedFileName)).catch(() => undefined);
        await this.activityService.log({
            userId: requester._id,
            type: ActivityType.MATERIAL_DELETE,
            materialId: id,
            ip: meta.ip,
            userAgent: meta.userAgent,
        });
    }

    async updateStatus(id: string, status: MaterialStatus, admin: JwtPayload) {
        const updated = await this.materialModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
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
