import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    isCompleted: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
