import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CurrentAffairsQuestionDocument = CurrentAffairsQuestion & Document;

@Schema({ timestamps: true })
export class CurrentAffairsQuestion {
  @Prop({ required: true })
  question!: string;

  @Prop({
    type: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, required: true, default: false },
      },
    ],
    validate: {
      validator: function (options: Array<{ text: string; isCorrect: boolean }>) {
        // Must have exactly 4 options
        if (options.length !== 4) {
          return false;
        }
        // Must have exactly 1 correct answer
        const correctAnswers = options.filter(option => option.isCorrect).length;
        return correctAnswers === 1;
      },
      message: 'Must have exactly 4 options with exactly 1 correct answer',
    },
  })
  options!: Array<{
    text: string;
    isCorrect: boolean;
  }>;

  @Prop({ required: true })
  explanation!: string;

  @Prop({ required: true })
  eventDate!: Date;

  @Prop({ required: true })
  source!: string;

  @Prop()
  sourceUrl?: string;

  @Prop({
    required: true,
    enum: ['easy', 'medium', 'hard'],
  })
  difficulty!: 'easy' | 'medium' | 'hard';

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ required: true, ref: 'Topic' })
  topicId!: Types.ObjectId;

  // Future extensibility fields
  @Prop()
  category?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ default: 0 })
  priority?: number;
}

export const CurrentAffairsQuestionSchema = SchemaFactory.createForClass(CurrentAffairsQuestion);

// Add indexes for better performance
CurrentAffairsQuestionSchema.index({ topicId: 1 });
CurrentAffairsQuestionSchema.index({ difficulty: 1 });
CurrentAffairsQuestionSchema.index({ eventDate: 1 });
CurrentAffairsQuestionSchema.index({ isActive: 1 });
CurrentAffairsQuestionSchema.index({ category: 1 });
