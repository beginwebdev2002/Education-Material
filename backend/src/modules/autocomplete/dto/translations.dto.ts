import { IsString, Length } from 'class-validator';

export class TranslationsDto {
    @IsString()
    @Length(1, 300)
    en: string;

    @IsString()
    @Length(1, 300)
    ru: string;

    @IsString()
    @Length(1, 300)
    tj: string;
}
