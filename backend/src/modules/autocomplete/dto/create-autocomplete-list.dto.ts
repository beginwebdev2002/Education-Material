import { Type } from 'class-transformer';
import { IsOptional, IsString, Length, Matches, ValidateNested } from 'class-validator';
import { TranslationsDto } from '@modules/autocomplete/dto/translations.dto';

export class CreateAutocompleteListDto {
    @IsString()
    @Length(2, 80)
    @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, { message: 'key must be a lowercase slug, e.g. "educational-institutions"' })
    key: string;

    @ValidateNested()
    @Type(() => TranslationsDto)
    labelTranslations: TranslationsDto;

    @IsOptional()
    @IsString()
    @Length(0, 500)
    description?: string;
}
