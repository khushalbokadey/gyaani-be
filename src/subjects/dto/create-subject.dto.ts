import { IsString, IsNotEmpty, IsOptional, IsHexColor } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsHexColor()
  color!: string;

  @IsString()
  @IsOptional()
  description?: string;
}