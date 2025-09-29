import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OtpDocument = Otp & Document;

export enum OtpType {
  EMAIL_VERIFICATION = 'email_verification',
  PHONE_VERIFICATION = 'phone_verification',
  PASSWORD_RESET = 'password_reset',
  LOGIN = 'login',
  PHONE_LOGIN = 'phone_login',
}

export enum OtpStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  USED = 'used',
}

@Schema({ timestamps: true })
export class Otp {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  code!: string;

  @Prop({ required: true })
  identifier!: string; // email or phone number

  @Prop({
    type: String,
    enum: OtpType,
    required: true,
  })
  type!: OtpType;

  @Prop({
    type: String,
    enum: OtpStatus,
    default: OtpStatus.PENDING,
  })
  status!: OtpStatus;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ default: 0 })
  attempts!: number;

  @Prop({ default: 3 })
  maxAttempts!: number;

  @Prop()
  verifiedAt?: Date;

  @Prop()
  userId?: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  metadata!: {
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
  };
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Add indexes for performance
OtpSchema.index({ identifier: 1, type: 1 });
OtpSchema.index({ code: 1 });
OtpSchema.index({ expiresAt: 1 });
OtpSchema.index({ status: 1 });
OtpSchema.index({ userId: 1 });

// TTL index to automatically delete expired OTPs after 24 hours
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });
