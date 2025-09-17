import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true })
export class Subject {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop({ default: 0 })
  totalTopics: number;

  @Prop({ default: 0 })
  completedTopics: number;

  @Prop({ default: 0 })
  progress: number;

  @Prop()
  description?: string;

  @Prop()
  lastStudied?: string;

  // Change this to use the Topic schema directly
  @Prop({ type: [Object], default: [] })
  topics: any[];
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);