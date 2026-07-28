import { IsEnum } from 'class-validator';
import { MaterialStatus } from '@modules/materials/material.interface';

export class UpdateMaterialStatusDto {
    @IsEnum(MaterialStatus)
    status: MaterialStatus;
}
