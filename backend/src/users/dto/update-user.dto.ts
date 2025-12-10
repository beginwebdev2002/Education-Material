import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, Length, IsPhoneNumber, IsUrl, IsOptional, IsEnum } from 'class-validator';
import { IsAllowedHost } from '../../common/validators/is-allowed-host.validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @Length(5, 15)
    @IsPhoneNumber()
    @IsOptional()
    phoneNumber: string;

    @IsString()
    @Length(2, 50)
    @IsOptional()
    country: string;

    @IsString()
    @IsEnum(UserRole)
    role: UserRole = UserRole.USER;

    @IsString()
    @Length(5, 15)
    @IsPhoneNumber()
    @IsAllowedHost(['wa.me'])
    @IsOptional()
    whatsappLink: string;

    @IsString()
    @Length(5, 50)
    @IsOptional()
    @IsUrl()
    @IsAllowedHost(['t.me'])
    telegramLink: string;

    @IsString()
    @Length(5, 50)
    @IsUrl()
    @IsAllowedHost(['instagram.com'])
    @IsOptional()
    instagramLink: string;

    @IsString()
    @Length(5, 50)
    @IsUrl()
    @IsAllowedHost(['linkedin.com'])
    @IsOptional()
    linkedinLink: string;
}
