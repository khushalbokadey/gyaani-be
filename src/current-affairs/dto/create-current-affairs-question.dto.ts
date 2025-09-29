import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsDateString,
  IsUrl,
  IsMongoId,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionOptionDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsNotEmpty()
  isCorrect!: boolean;
}

export class CreateCurrentAffairsQuestionDto {
  @IsString()
  @IsNotEmpty()
  question!: string;

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options!: QuestionOptionDto[];

  @IsString()
  @IsNotEmpty()
  explanation!: string;

  @IsDateString()
  eventDate!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;

  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @IsEnum(['easy', 'medium', 'hard'])
  difficulty!: 'easy' | 'medium' | 'hard';

  @IsMongoId()
  topicId!: string;

  // Future extensibility fields
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  priority?: number;
}

export class CreateBulkCurrentAffairsQuestionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50) // Limit to 50 questions at once
  @ValidateNested({ each: true })
  @Type(() => CreateCurrentAffairsQuestionDto)
  questions!: CreateCurrentAffairsQuestionDto[];
}
