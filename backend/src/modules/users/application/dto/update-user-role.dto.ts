import { IsEnum } from 'class-validator';
import { UserRole } from '@modules/users/domain/user.interface';

export class UpdateUserRoleDto {
    @IsEnum(UserRole)
    role: UserRole;
}
