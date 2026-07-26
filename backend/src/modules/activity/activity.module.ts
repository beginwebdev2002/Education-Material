import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from './domain/activity.schema';
import { ActivityService } from './application/activity.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }])],
    providers: [ActivityService],
    exports: [ActivityService],
})
export class ActivityModule { }
