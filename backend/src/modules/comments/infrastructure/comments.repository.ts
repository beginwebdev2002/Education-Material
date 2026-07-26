import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '@modules/comments/domain/comment.schema';
import { PaginatedResult } from '@modules/users/domain/users.repository.interface';

const AUTHOR_POPULATE = 'firstName lastName avatar';

@Injectable()
export class CommentsRepository {
    constructor(
        @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    ) { }

    async create(materialId: string, authorId: string, text: string): Promise<CommentDocument> {
        const comment = await this.commentModel.create({
            material: new Types.ObjectId(materialId),
            author: new Types.ObjectId(authorId),
            text,
        });
        return comment.populate('author', AUTHOR_POPULATE);
    }

    async findById(id: string): Promise<CommentDocument | null> {
        return this.commentModel.findById(id).exec();
    }

    async findByMaterial(materialId: string, page: number, limit: number): Promise<PaginatedResult<CommentDocument>> {
        const filter = { material: new Types.ObjectId(materialId) };
        const [items, total] = await Promise.all([
            this.commentModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('author', AUTHOR_POPULATE)
                .exec(),
            this.commentModel.countDocuments(filter).exec(),
        ]);
        return { items, total, page, limit };
    }

    async findAllPaginated(page: number, limit: number): Promise<PaginatedResult<CommentDocument>> {
        const [items, total] = await Promise.all([
            this.commentModel
                .find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('author', AUTHOR_POPULATE)
                .populate('material', 'title')
                .exec(),
            this.commentModel.countDocuments().exec(),
        ]);
        return { items, total, page, limit };
    }

    async deleteById(id: string): Promise<CommentDocument | null> {
        return this.commentModel.findByIdAndDelete(id).exec();
    }

    async countAll(): Promise<number> {
        return this.commentModel.countDocuments().exec();
    }
}
