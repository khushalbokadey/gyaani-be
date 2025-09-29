import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @IsNumber()
  @IsOptional()
  progress?: number;

  @IsNumber()
  @IsOptional()
  totalTopics?: number;

  @IsNumber()
  @IsOptional()
  completedTopics?: number;

  @IsString()
  @IsOptional()
  lastStudied?: string;
}
