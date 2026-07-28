import { Type } from 'class-transformer';
import { IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { TranslationsDto } from '@modules/autocomplete/dto/translations.dto';

export class UpdateAutocompleteListDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => TranslationsDto)
    labelTranslations?: TranslationsDto;

    @IsOptional()
    @IsString()
    @Length(0, 500)
    description?: string;
}
