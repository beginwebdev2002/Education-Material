import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { Translations } from '@modules/autocomplete/autocomplete.interface';

export type AutocompleteListDocument = AutocompleteList & Document;

@Schema({ timestamps: true })
export class AutocompleteList {
    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    key: string;

    @Prop({ type: { en: String, ru: String, tj: String }, required: true })
    labelTranslations: Translations;

    @Prop({ trim: true })
    description?: string;
}

export const AutocompleteListSchema = SchemaFactory.createForClass(AutocompleteList);
