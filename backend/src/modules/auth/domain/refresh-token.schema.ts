import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users', required: true, index: true })
    user: Types.ObjectId;

    @Prop({ required: true, unique: true })
    tokenHash: string;

    @Prop()
    userAgent?: string;

    @Prop()
    ip?: string;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ type: Date, default: null })
    revokedAt: Date | null;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
