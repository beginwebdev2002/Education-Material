import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { MaterialCategory, MaterialFormat, MaterialStatus } from '@modules/materials/material.interface';

export type MaterialDocument = Material & Document;

@Schema({ timestamps: true })
export class Material {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AutocompleteItem', required: true, index: true })
    institution: Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AutocompleteItem', required: true, index: true })
    subject: Types.ObjectId;

    @Prop({ type: [String], enum: MaterialCategory, default: [] })
    category: MaterialCategory[];

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
MaterialSchema.index({ title: 'text', description: 'text' });
MaterialSchema.index({ createdAt: -1 });
