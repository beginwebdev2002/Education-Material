import { IsString, Length } from 'class-validator';

export class CreateMaterialDto {
    @IsString()
    @Length(3, 150)
    title: string;

    @IsString()
    @Length(10, 2000)
    description: string;

    @IsString()
    @Length(2, 100)
    subject: string;

    @IsString()
    @Length(1, 100)
    level: string;
}
