import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '@modules/comments/infrastructure/comments.repository';
import { MaterialsRepository } from '@modules/materials/infrastructure/materials.repository';
import { ActivityService } from '@modules/activity/application/activity.service';
import { ActivityType } from '@modules/activity/domain/activity.interface';
import { JwtPayload } from '@modules/auth/jwt-payload.interface';
import { UserRole } from '@modules/users/user-role.enum';
import { UsersService } from '@modules/users/users.service';
import { RequestMeta } from '@common/interfaces/request-meta.interface';

@Injectable()
export class CommentsService {
    constructor(
        private readonly commentsRepository: CommentsRepository,
        private readonly materialsRepository: MaterialsRepository,
        private readonly activityService: ActivityService,
        private readonly usersService: UsersService,
    ) { }

    async create(materialId: string, author: JwtPayload, text: string, meta: RequestMeta) {
        const material = await this.materialsRepository.findById(materialId);
        if (!material) {
            throw new NotFoundException('Material not found');
        }

        const comment = await this.commentsRepository.create(materialId, author._id, text);
        await this.materialsRepository.incrementComments(materialId, 1);
        await this.activityService.log({
            userId: author._id,
            type: ActivityType.MATERIAL_COMMENT,
            materialId,
            ip: meta.ip,
            userAgent: meta.userAgent,
        });

        return comment;
    }

    async listForMaterial(materialId: string, page: number, limit: number) {
        return this.commentsRepository.findByMaterial(materialId, page, limit);
    }

    async listAllForAdmin(page: number, limit: number) {
        return this.commentsRepository.findAllPaginated(page, limit);
    }

    async remove(id: string, requester: JwtPayload) {
        const comment = await this.commentsRepository.findById(id);
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

        await this.commentsRepository.deleteById(id);
        await this.materialsRepository.incrementComments(comment.material.toString(), -1);
    }
}
