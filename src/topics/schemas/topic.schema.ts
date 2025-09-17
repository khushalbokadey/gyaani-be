import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, ref: 'Subject' })
  subjectId: Types.ObjectId;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ required: true })
  difficulty: string; // Easy, Medium, Hard

  @Prop({ required: true })
  estimatedTime: string;

  @Prop({ default: 0 })
  totalLessons: number;

  @Prop({ default: 0 })
  completedLessons: number;

  @Prop({ default: 0 })
  totalQuestions: number;

  @Prop({ default: false })
  isLocked: boolean;

  @Prop()
  description?: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);