import { PartialType } from '@nestjs/mapped-types';
import { CreateCurrentAffairsQuestionDto } from './create-current-affairs-question.dto';

export class UpdateCurrentAffairsQuestionDto extends PartialType(CreateCurrentAffairsQuestionDto) {}
