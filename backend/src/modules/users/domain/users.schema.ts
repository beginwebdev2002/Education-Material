import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '@modules/users/domain/user.interface';

export type UsersDocument = Users & Document;
@Schema({ timestamps: true })
export class Users {
    _id: string;


    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    country: string;

    @Prop({
        type: String,
        default: "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
    })
    avatar: string;

    @Prop({
        type: String,
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Prop()
    whatsappLink: string;

    @Prop()
    telegramLink: string;

    @Prop()
    instagramLink: string;

    @Prop()
    linkedinLink: string;

    @Prop({ type: Date, default: null })
    lastSeenAt: Date | null;

    @Prop({ type: Boolean, default: false })
    isBanned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(Users);

UserSchema.set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
        const sanitized = ret as unknown as Record<string, unknown>;
        delete sanitized['password'];
        delete sanitized['__v'];
        return sanitized;
    },
});
