import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from '@modules/activity/entities/activity.schema';
import { ActivityService } from '@modules/activity/activity.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }])],
    providers: [ActivityService],
    exports: [ActivityService],
})
export class ActivityModule { }
