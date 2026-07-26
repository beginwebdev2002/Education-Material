import { IsOptional, IsPhoneNumber, IsString, IsUrl, Length } from 'class-validator';
import { IsAllowedHost } from '@common/validators/is-allowed-host.validator';

export class UpdateProfileDto {
    @IsString()
    @Length(3, 50)
    @IsOptional()
    firstName?: string;

    @IsString()
    @Length(3, 50)
    @IsOptional()
    lastName?: string;

    @IsString()
    @Length(5, 15)
    @IsPhoneNumber()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @Length(2, 50)
    @IsOptional()
    country?: string;

    @IsUrl()
    @IsOptional()
    avatar?: string;

    @IsString()
    @Length(5, 15)
    @IsPhoneNumber()
    @IsAllowedHost(['wa.me'])
    @IsOptional()
    whatsappLink?: string;

    @IsString()
    @Length(5, 50)
    @IsUrl()
    @IsAllowedHost(['t.me'])
    @IsOptional()
    telegramLink?: string;

    @IsString()
    @Length(5, 50)
    @IsUrl()
    @IsAllowedHost(['instagram.com'])
    @IsOptional()
    instagramLink?: string;

    @IsString()
    @Length(5, 50)
    @IsUrl()
    @IsAllowedHost(['linkedin.com'])
    @IsOptional()
    linkedinLink?: string;
}
