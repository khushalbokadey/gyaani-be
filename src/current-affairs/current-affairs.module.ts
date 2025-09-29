import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrentAffairsService } from './current-affairs.service';
import { CurrentAffairsController } from './current-affairs.controller';
import { CurrentAffairsQuestion, CurrentAffairsQuestionSchema } from './schemas/current-affairs-question.schema';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CurrentAffairsQuestion.name, schema: CurrentAffairsQuestionSchema },
    ]),
    CoreModule,
  ],
  controllers: [CurrentAffairsController],
  providers: [CurrentAffairsService],
  exports: [CurrentAffairsService],
})
export class CurrentAffairsModule {}
