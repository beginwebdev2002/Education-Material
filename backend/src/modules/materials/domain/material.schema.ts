import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { MaterialFormat, MaterialStatus } from './material.interface';

export type MaterialDocument = Material & Document;

@Schema({ timestamps: true })
export class Material {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ required: true, trim: true })
    subject: string;

    @Prop({ required: true, trim: true })
    level: string;

    @Prop({ type: String, enum: MaterialFormat, required: true })
    format: MaterialFormat;

    @Prop({ required: true })
    originalName: string;

    @Prop({ required: true })
    storedFileName: string;

    @Prop({ required: true })
    mimeType: string;

    @Prop({ required: true })
    size: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users', required: true, index: true })
    owner: Types.ObjectId;

    @Prop({ type: String, enum: MaterialStatus, default: MaterialStatus.PENDING, index: true })
    status: MaterialStatus;

    @Prop({ default: 0 })
    downloadsCount: number;

    @Prop({ default: 0 })
    commentsCount: number;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
MaterialSchema.index({ title: 'text', description: 'text', subject: 'text' });
MaterialSchema.index({ createdAt: -1 });
