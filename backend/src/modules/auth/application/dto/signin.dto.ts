import { IsEmail, IsString, Length } from "class-validator";

export class SigninDto {
    @IsString()
    @IsEmail()
    @Length(6, 50)
    email: string;

    @IsString()
    @Length(8, 50)
    password: string;
}