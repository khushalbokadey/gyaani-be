import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument, OtpType, OtpStatus } from '../schemas/otp.schema';
import { LoggerService } from '../../core/logging/logger.service';
import {
  ConflictError,
  ValidationError,
  NotFoundError,
} from '../../shared/errors/application.error';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Generate a random OTP code
   */
  private generateOtpCode(length: number = 6): string {
    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
  }

  /**
   * Create a new OTP
   */
  async createOtp(
    identifier: string,
    type: OtpType,
    userId?: string,
    metadata?: any,
  ): Promise<Otp> {
    try {
      this.logger.log(`Creating OTP for ${identifier}, type: ${type}`);

      // Check if there's already a pending OTP for this identifier and type
      const existingOtp = await this.otpModel.findOne({
        identifier,
        type,
        status: OtpStatus.PENDING,
        expiresAt: { $gt: new Date() },
      });

      if (existingOtp) {
        // If OTP was created less than 1 minute ago, don't create a new one
        const timeDiff = Date.now() - (existingOtp as any).createdAt.getTime();
        if (timeDiff < 60000) {
          // 1 minute
          throw new ConflictError('Please wait before requesting a new OTP');
        }

        // Mark existing OTP as expired
        await this.otpModel.findByIdAndUpdate(existingOtp._id, {
          status: OtpStatus.EXPIRED,
        });
      }

      // Generate OTP code
      const code = this.generateOtpCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create new OTP
      const otp = new this.otpModel({
        code,
        identifier,
        type,
        expiresAt,
        userId,
        metadata: {
          ipAddress: metadata?.ipAddress,
          userAgent: metadata?.userAgent,
          deviceId: metadata?.deviceId,
        },
      });

      const savedOtp = await otp.save();
      this.logger.log(`OTP created successfully for ${identifier}`);
      this.logger.log(`🔑 OTP CODE: ${code} (expires in 10 minutes)`);

      return savedOtp;
    } catch (error) {
      this.logger.error(
        'Error creating OTP',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(
    identifier: string,
    code: string,
    type: OtpType,
  ): Promise<Otp> {
    try {
      this.logger.log(`Verifying OTP for ${identifier}, type: ${type}`);

      const otp = await this.otpModel.findOne({
        identifier,
        code,
        type,
        status: OtpStatus.PENDING,
        expiresAt: { $gt: new Date() },
      });

      if (!otp) {
        throw new NotFoundError('Invalid or expired OTP');
      }

      // Check if max attempts exceeded
      if (otp.attempts >= otp.maxAttempts) {
        await this.otpModel.findByIdAndUpdate(otp._id, {
          status: OtpStatus.EXPIRED,
        });
        throw new ValidationError(
          'Maximum verification attempts exceeded',
          'otp',
        );
      }

      // Increment attempts
      await this.otpModel.findByIdAndUpdate(otp._id, {
        $inc: { attempts: 1 },
      });

      // Mark as verified
      await this.otpModel.findByIdAndUpdate(otp._id, {
        status: OtpStatus.VERIFIED,
        verifiedAt: new Date(),
      });

      this.logger.log(`OTP verified successfully for ${identifier}`);
      return otp;
    } catch (error) {
      this.logger.error(
        'Error verifying OTP',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Resend OTP
   */
  async resendOtp(
    identifier: string,
    type: OtpType,
    metadata?: any,
  ): Promise<Otp> {
    try {
      this.logger.log(`Resending OTP for ${identifier}, type: ${type}`);

      // Mark all existing OTPs for this identifier and type as expired
      await this.otpModel.updateMany(
        {
          identifier,
          type,
          status: OtpStatus.PENDING,
        },
        {
          status: OtpStatus.EXPIRED,
        },
      );

      // Create new OTP
      return this.createOtp(identifier, type, undefined, metadata);
    } catch (error) {
      this.logger.error(
        'Error resending OTP',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Get OTP by identifier and type
   */
  async getOtp(identifier: string, type: OtpType): Promise<Otp | null> {
    try {
      return this.otpModel
        .findOne({
          identifier,
          type,
          status: OtpStatus.PENDING,
          expiresAt: { $gt: new Date() },
        })
        .sort({ createdAt: -1 });
    } catch (error) {
      this.logger.error(
        'Error getting OTP',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Clean up expired OTPs
   */
  async cleanupExpiredOtps(): Promise<number> {
    try {
      const result = await this.otpModel.updateMany(
        {
          status: OtpStatus.PENDING,
          expiresAt: { $lt: new Date() },
        },
        {
          status: OtpStatus.EXPIRED,
        },
      );

      this.logger.log(`Cleaned up ${result.modifiedCount} expired OTPs`);
      return result.modifiedCount;
    } catch (error) {
      this.logger.error(
        'Error cleaning up expired OTPs',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Get OTP statistics
   */
  async getOtpStats(
    identifier: string,
    type: OtpType,
  ): Promise<{
    totalAttempts: number;
    recentAttempts: number;
    lastAttempt: Date | null;
  }> {
    try {
      const recentTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

      const [totalAttempts, recentAttempts, lastAttempt] = await Promise.all([
        this.otpModel.countDocuments({ identifier, type }),
        this.otpModel.countDocuments({
          identifier,
          type,
          createdAt: { $gte: recentTime },
        }),
        this.otpModel
          .findOne({ identifier, type })
          .sort({ createdAt: -1 })
          .select('createdAt')
          .lean(),
      ]);

      return {
        totalAttempts,
        recentAttempts,
        lastAttempt: (lastAttempt as any)?.createdAt || null,
      };
    } catch (error) {
      this.logger.error(
        'Error getting OTP stats',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
