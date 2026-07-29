import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '@modules/comments/entities/comment.schema';
import { MaterialsService } from '@modules/materials/materials.service';
import { ActivityService } from '@modules/activity/activity.service';
import { ActivityType } from '@modules/activity/activity.interface';
import { JwtPayload } from '@modules/auth/jwt-payload.interface';
import { UserRole } from '@modules/users/user-role.enum';
import { UsersService } from '@modules/users/users.service';
import { RequestMeta } from '@common/interfaces/request-meta.interface';
import { PaginatedResult } from '@common/interfaces/paginated-result.interface';

const AUTHOR_POPULATE = 'firstName lastName avatar';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
        private readonly materialsService: MaterialsService,
        private readonly activityService: ActivityService,
        private readonly usersService: UsersService,
    ) { }

    async create(materialId: string, author: JwtPayload, text: string, meta: RequestMeta) {
        const material = await this.materialsService.findById(materialId);
        if (!material) {
            throw new NotFoundException('Material not found');
        }

        const comment = await this.commentModel.create({
            material: new Types.ObjectId(materialId),
            author: new Types.ObjectId(author._id),
            text,
        });
        await comment.populate('author', AUTHOR_POPULATE);
        await this.materialsService.incrementComments(materialId, 1);
        await this.activityService.log({
            userId: author._id,
            type: ActivityType.MATERIAL_COMMENT,
            materialId,
            ip: meta.ip,
            userAgent: meta.userAgent,
        });

        return comment;
    }

    async listForMaterial(materialId: string, page: number, limit: number): Promise<PaginatedResult<CommentDocument>> {
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

    async listAllForAdmin(page: number, limit: number, search?: string): Promise<PaginatedResult<CommentDocument>> {
        const filter = await this.buildAdminSearchFilter(search);
        const [items, total] = await Promise.all([
            this.commentModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('author', AUTHOR_POPULATE)
                .populate('material', 'title')
                .exec(),
            this.commentModel.countDocuments(filter).exec(),
        ]);
        return { items, total, page, limit };
    }

    private async buildAdminSearchFilter(search?: string): Promise<Record<string, unknown>> {
        if (!search) {
            return {};
        }
        const matchingAuthorIds = await this.usersService.findIdsBySearch(search);
        return {
            $or: [
                { text: { $regex: search, $options: 'i' } },
                { author: { $in: matchingAuthorIds.map((id) => new Types.ObjectId(id)) } },
            ],
        };
    }

    async countAll(): Promise<number> {
        return this.commentModel.countDocuments().exec();
    }

    async remove(id: string, requester: JwtPayload, meta: RequestMeta = {}) {
        const comment = await this.commentModel.findById(id).exec();
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        const isOwner = comment.author.toString() === requester._id;
        if (!isOwner) {
            const requesterUser = await this.usersService.findById(requester._id);
            if (requesterUser?.role !== UserRole.ADMIN) {
                throw new ForbiddenException('You cannot delete this comment');
            }
        }

        await this.commentModel.findByIdAndDelete(id).exec();
        await this.materialsService.incrementComments(comment.material.toString(), -1);
        await this.activityService.log({
            userId: requester._id,
            type: ActivityType.COMMENT_DELETE,
            materialId: comment.material.toString(),
            ip: meta.ip,
            userAgent: meta.userAgent,
        });
    }
}
