import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsMongoId, IsString, Length } from 'class-validator';
import { MaterialCategory } from '@modules/materials/material.interface';

export class CreateMaterialDto {
    @IsString()
    @Length(3, 150)
    title: string;

    @IsString()
    @Length(10, 2000)
    description: string;

    @IsMongoId()
    institution: string;

    @IsMongoId()
    subject: string;

    // multipart/form-data only produces an array when a field name repeats
    // more than once; a single selected category arrives as a bare string.
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(MaterialCategory, { each: true })
    category: MaterialCategory[];
}
