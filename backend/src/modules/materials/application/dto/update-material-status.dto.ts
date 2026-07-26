import { IsEnum } from 'class-validator';
import { MaterialStatus } from '@modules/materials/domain/material.interface';

export class UpdateMaterialStatusDto {
    @IsEnum(MaterialStatus)
    status: MaterialStatus;
}
