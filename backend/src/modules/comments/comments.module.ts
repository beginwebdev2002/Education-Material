import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './domain/comment.schema';
import { CommentsRepository } from './infrastructure/comments.repository';
import { CommentsController } from './infrastructure/comments.controller';
import { CommentsService } from './application/comments.service';
import { MaterialsModule } from '@modules/materials/materials.module';
import { ActivityModule } from '@modules/activity/activity.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        MaterialsModule,
        ActivityModule,
    ],
    controllers: [CommentsController],
    providers: [CommentsService, CommentsRepository],
    exports: [CommentsRepository],
})
export class CommentsModule { }
