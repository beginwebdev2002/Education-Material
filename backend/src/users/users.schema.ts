import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema({ timestamps: true })
export class Users {


    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    country: string;

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
