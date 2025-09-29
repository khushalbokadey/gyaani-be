import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class PhoneRegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please provide a valid phone number',
  })
  phoneNumber!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'Profile image URL must not exceed 500 characters',
  })
  profileImage?: string;
}
