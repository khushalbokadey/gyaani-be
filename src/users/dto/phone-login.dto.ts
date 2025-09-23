import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class PhoneLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please provide a valid phone number' })
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP code is required' })
  otpCode!: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  fcmToken?: string; // For push notifications
}
