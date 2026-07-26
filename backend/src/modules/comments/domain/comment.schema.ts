import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Material', required: true, index: true })
    material: Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users', required: true, index: true })
    author: Types.ObjectId;

    @Prop({ required: true, trim: true, maxlength: 1000 })
    text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ createdAt: -1 });
