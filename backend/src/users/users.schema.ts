import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}
@Schema({ timestamps: true })
export class Users {


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
        enum: Role,
        default: Role.USER
    })
    role: Role;

    @Prop()
    whatsappLink: string;

    @Prop()
    telegramLink: string;

    @Prop()
    instagramLink: string;

    @Prop()
    linkedinLink: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
