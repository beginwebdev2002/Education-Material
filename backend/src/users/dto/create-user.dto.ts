import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(3, 50)
    firstName: string;

    @IsString()
    @Length(3, 50)
    lastName: string;

    @IsString()
    @IsEmail()
    @Length(6, 50)
    email: string;

    @IsString()
    @Length(6, 50)
    password: string;
}
