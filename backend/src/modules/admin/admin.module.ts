import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/infrastructure/users.module';
import { MaterialsModule } from '@modules/materials/materials.module';
import { CommentsModule } from '@modules/comments/comments.module';
import { ActivityModule } from '@modules/activity/activity.module';
import { AdminService } from './application/admin.service';
import { AdminController } from './infrastructure/admin.controller';

@Module({
    imports: [UsersModule, MaterialsModule, CommentsModule, ActivityModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
