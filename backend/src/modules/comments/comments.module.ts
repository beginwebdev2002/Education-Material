import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '@modules/comments/entities/comment.schema';
import { CommentsController } from '@modules/comments/comments.controller';
import { CommentsService } from '@modules/comments/comments.service';
import { MaterialsModule } from '@modules/materials/materials.module';
import { ActivityModule } from '@modules/activity/activity.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        MaterialsModule,
        ActivityModule,
        UsersModule,
    ],
    controllers: [CommentsController],
    providers: [CommentsService],
    exports: [CommentsService],
})
export class CommentsModule { }
