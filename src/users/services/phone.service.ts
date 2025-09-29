import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../core/logging/logger.service';

@Injectable()
export class PhoneService {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Send OTP via SMS
   * In production, this would integrate with SMS providers like Twilio, AWS SNS, etc.
   */
  async sendOtpSms(
    phoneNumber: string,
    otpCode: string,
    type: string,
    firstName?: string,
  ): Promise<void> {
    try {
      this.logger.log(`Sending OTP SMS to ${phoneNumber}`);

      // Mock SMS sending - in production, replace with actual SMS service
      const message = this.buildOtpMessage(otpCode, type, firstName);

      // Log the OTP for development/testing purposes
      this.logger.log(`📱 SMS OTP for ${phoneNumber}: ${otpCode} (${type})`);
      this.logger.log(`📱 SMS Message: ${message}`);

      // In production, you would call your SMS provider here:
      // await this.smsProvider.send(phoneNumber, message);

      this.logger.log(`OTP SMS sent successfully to ${phoneNumber}`);
    } catch (error) {
      this.logger.error(
        'Error sending OTP SMS',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Build OTP message based on type
   */
  private buildOtpMessage(
    otpCode: string,
    type: string,
    firstName?: string,
  ): string {
    const greeting = firstName ? `Hi ${firstName}` : 'Hello';

    switch (type) {
      case 'phone_verification':
        return `${greeting}, your phone verification code is ${otpCode}. This code will expire in 10 minutes.`;
      case 'login':
        return `${greeting}, your login code is ${otpCode}. This code will expire in 10 minutes.`;
      default:
        return `${greeting}, your verification code is ${otpCode}. This code will expire in 10 minutes.`;
    }
  }

  /**
   * Send welcome SMS
   */
  async sendWelcomeSms(phoneNumber: string, firstName: string): Promise<void> {
    try {
      this.logger.log(`Sending welcome SMS to ${phoneNumber}`);

      const message = `Welcome to Gyaani, ${firstName}! Your account has been successfully created. Start your learning journey now!`;

      // Log the welcome message for development/testing purposes
      this.logger.log(`📱 Welcome SMS for ${phoneNumber}: ${message}`);

      // In production, you would call your SMS provider here:
      // await this.smsProvider.send(phoneNumber, message);

      this.logger.log(`Welcome SMS sent successfully to ${phoneNumber}`);
    } catch (error) {
      this.logger.error(
        'Error sending welcome SMS',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
