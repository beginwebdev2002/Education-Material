import { IsBoolean, IsEnum, IsString } from "class-validator";


enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}
export class CreateTaskDto {
    @IsEnum(Role)
    role: Role;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsBoolean()
    isCompleted: boolean;
}