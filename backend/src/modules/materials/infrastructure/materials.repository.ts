import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Material, MaterialDocument } from '@modules/materials/domain/material.schema';
import { MaterialStatus } from '@modules/materials/domain/material.interface';
import { PaginatedResult } from '@modules/users/domain/users.repository.interface';

export interface CreateMaterialInput {
    title: string;
    description: string;
    subject: string;
    level: string;
    format: string;
    originalName: string;
    storedFileName: string;
    mimeType: string;
    size: number;
    owner: string;
}

const OWNER_POPULATE = 'firstName lastName avatar email';

@Injectable()
export class MaterialsRepository {
    constructor(
        @InjectModel(Material.name) private readonly materialModel: Model<MaterialDocument>,
    ) { }

    async create(data: CreateMaterialInput): Promise<MaterialDocument> {
        const material = await this.materialModel.create({ ...data, owner: new Types.ObjectId(data.owner) });
        return material.populate('owner', OWNER_POPULATE);
    }

    /** Raw lookup (owner left unpopulated) for internal ownership checks. */
    async findById(id: string): Promise<MaterialDocument | null> {
        return this.materialModel.findById(id).exec();
    }

    async findPublished(params: { search?: string; sortBy?: 'downloads' | 'date'; page: number; limit: number }): Promise<PaginatedResult<MaterialDocument>> {
        const { search, sortBy, page, limit } = params;
        const filter: Record<string, unknown> = { status: MaterialStatus.PUBLISHED };
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const sort: Record<string, 1 | -1> = sortBy === 'downloads' ? { downloadsCount: -1 } : { createdAt: -1 };

        const [items, total] = await Promise.all([
            this.materialModel
                .find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('owner', OWNER_POPULATE)
                .exec(),
            this.materialModel.countDocuments(filter).exec(),
        ]);

        return { items, total, page, limit };
    }

    async findByOwner(ownerId: string, page: number, limit: number): Promise<PaginatedResult<MaterialDocument>> {
        const filter = { owner: new Types.ObjectId(ownerId) };
        const [items, total] = await Promise.all([
            this.materialModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.materialModel.countDocuments(filter).exec(),
        ]);
        return { items, total, page, limit };
    }

    async findAllPaginated(params: { search?: string; status?: MaterialStatus; page: number; limit: number }): Promise<PaginatedResult<MaterialDocument>> {
        const { search, status, page, limit } = params;
        const filter: Record<string, unknown> = {};
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.materialModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('owner', OWNER_POPULATE)
                .exec(),
            this.materialModel.countDocuments(filter).exec(),
        ]);
        return { items, total, page, limit };
    }

    async incrementDownloads(id: string): Promise<void> {
        await this.materialModel.updateOne({ _id: id }, { $inc: { downloadsCount: 1 } }).exec();
    }

    async incrementComments(id: string, delta: number): Promise<void> {
        await this.materialModel.updateOne({ _id: id }, { $inc: { commentsCount: delta } }).exec();
    }

    async updateStatus(id: string, status: MaterialStatus): Promise<MaterialDocument | null> {
        return this.materialModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }

    async deleteById(id: string): Promise<MaterialDocument | null> {
        return this.materialModel.findByIdAndDelete(id).exec();
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

    async topByDownloads(limit: number): Promise<MaterialDocument[]> {
        return this.materialModel
            .find({ status: MaterialStatus.PUBLISHED })
            .sort({ downloadsCount: -1 })
            .limit(limit)
            .populate('owner', OWNER_POPULATE)
            .exec();
    }
}
