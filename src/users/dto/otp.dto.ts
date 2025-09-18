import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { OtpType } from '../schemas/otp.schema';

export class RequestOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Email or phone number is required' })
  identifier!: string;

  @IsEnum(OtpType, { message: 'Invalid OTP type' })
  type!: OtpType;

  @IsOptional()
  @IsString()
  deviceId?: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Email or phone number is required' })
  identifier!: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP code is required' })
  code!: string;

  @IsEnum(OtpType, { message: 'Invalid OTP type' })
  type!: OtpType;

  @IsOptional()
  @IsString()
  deviceId?: string;
}

export class ResendOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Email or phone number is required' })
  identifier!: string;

  @IsEnum(OtpType, { message: 'Invalid OTP type' })
  type!: OtpType;
}
