import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Email or phone number is required' })
  identifier!: string; // Can be email or phone number

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  fcmToken?: string; // For push notifications
}

export class LoginWithOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Email or phone number is required' })
  identifier!: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP code is required' })
  @IsString()
  otpCode!: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  fcmToken?: string;
}
