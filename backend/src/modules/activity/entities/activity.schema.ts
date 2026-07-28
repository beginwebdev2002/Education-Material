import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { ActivityType } from '@modules/activity/activity.interface';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Activity {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users', required: true, index: true })
    user: Types.ObjectId;

    @Prop({ type: String, enum: ActivityType, required: true, index: true })
    type: ActivityType;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Material', required: false })
    material?: Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.Mixed, required: false })
    metadata?: Record<string, unknown>;

    @Prop()
    ip?: string;

    @Prop()
    userAgent?: string;

    createdAt: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
ActivitySchema.index({ createdAt: -1 });
