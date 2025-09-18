import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsIn } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  subjectId!: string;

  @IsString()
  @IsIn(['Easy', 'Medium', 'Hard'])
  difficulty!: string;

  @IsString()
  @IsNotEmpty()
  estimatedTime!: string;

  @IsNumber()
  @IsOptional()
  totalLessons?: number;

  @IsNumber()
  @IsOptional()
  totalQuestions?: number;

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}