import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import type { Translations } from '@modules/autocomplete/autocomplete.interface';

export type AutocompleteItemDocument = AutocompleteItem & Document;

@Schema({ timestamps: true })
export class AutocompleteItem {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AutocompleteList', required: true, index: true })
    list: Types.ObjectId;

    @Prop({ type: { en: String, ru: String, tj: String }, required: true })
    translations: Translations;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'AutocompleteItem', default: [] })
    parentItems: Types.ObjectId[];

    @Prop({ type: MongooseSchema.Types.Mixed })
    metadata?: Record<string, unknown>;
}

export const AutocompleteItemSchema = SchemaFactory.createForClass(AutocompleteItem);
AutocompleteItemSchema.index({ list: 1 });
AutocompleteItemSchema.index({ 'translations.en': 'text', 'translations.ru': 'text', 'translations.tj': 'text' });
