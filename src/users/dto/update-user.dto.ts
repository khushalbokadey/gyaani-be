import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { UserStatus } from '../schemas/user.schema';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Invalid user status' })
  status?: UserStatus;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  isPhoneVerified?: boolean;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsObject()
  preferences?: {
    notifications?: boolean;
    darkMode?: boolean;
    language?: string;
    timezone?: string;
  };
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword!: string;

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  newPassword!: string;
}

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Reset token is required' })
  token!: string;

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  newPassword!: string;
}
