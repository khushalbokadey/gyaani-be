import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  TEACHER = 'teacher',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

@Schema({ timestamps: true })
export class User {
  _id!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, unique: true })
  phoneNumber!: string;

  @Prop({ 
    type: String, 
    enum: UserRole, 
    default: UserRole.STUDENT 
  })
  role!: UserRole;

  @Prop({ 
    type: String, 
    enum: UserStatus, 
    default: UserStatus.PENDING 
  })
  status!: UserStatus;

  @Prop({ default: false })
  isEmailVerified!: boolean;

  @Prop({ default: false })
  isPhoneVerified!: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  phoneVerificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  profileImage?: string;

  @Prop({ default: 0 })
  totalStudyTime!: number; // in minutes

  @Prop({ default: 0 })
  currentStreak!: number; // days

  @Prop({ default: 0 })
  longestStreak!: number; // days

  @Prop({ default: 0 })
  totalQuestionsAnswered!: number;

  @Prop({ default: 0 })
  correctAnswers!: number;

  @Prop({ type: [String], default: [] })
  achievements!: string[];

  @Prop({ type: Object, default: {} })
  preferences!: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
    timezone: string;
  };

  @Prop({ type: Object, default: {} })
  progress!: {
    totalSubjects: number;
    completedSubjects: number;
    totalTopics: number;
    completedTopics: number;
    overallProgress: number;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ phoneVerificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });
