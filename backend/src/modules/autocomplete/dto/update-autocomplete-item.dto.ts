import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { TranslationsDto } from '@modules/autocomplete/dto/translations.dto';

export class UpdateAutocompleteItemDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => TranslationsDto)
    translations?: TranslationsDto;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    parentItems?: string[];

    @IsOptional()
    @IsObject()
    metadata?: Record<string, unknown>;
}
