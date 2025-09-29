import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../core/logging/logger.service';
import { OtpType } from '../schemas/otp.schema';

@Injectable()
export class EmailService {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Send OTP via email
   */
  async sendOtpEmail(
    email: string,
    otpCode: string,
    type: OtpType,
    firstName?: string,
  ): Promise<void> {
    try {
      this.logger.log(`Sending OTP email to ${email}, type: ${type}`);

      const subject = this.getEmailSubject(type);
      this.generateOtpEmailHtml(otpCode, type, firstName);
      this.generateOtpEmailText(otpCode, type, firstName);

      // In a real implementation, you would use an email service like:
      // - SendGrid
      // - AWS SES
      // - Nodemailer with SMTP
      // - Mailgun
      // - etc.

      // For now, we'll just log the email content
      this.logger.log(`Email would be sent to ${email}:`);
      this.logger.log(`Subject: ${subject}`);
      this.logger.log(`Content: OTP email content`);

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      this.logger.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(
        'Error sending OTP email',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      this.logger.log(`Sending welcome email to ${email}`);

      const subject = 'Welcome to Gyaani - Start Your Learning Journey!';
      this.generateWelcomeEmailHtml(firstName);
      this.generateWelcomeEmailText(firstName);

      // Log the email content (in production, send actual email)
      this.logger.log(`Welcome email would be sent to ${email}:`);
      this.logger.log(`Subject: ${subject}`);
      this.logger.log(`Content: Welcome email content`);

      await new Promise((resolve) => setTimeout(resolve, 100));
      this.logger.log(`Welcome email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(
        'Error sending welcome email',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    firstName?: string,
  ): Promise<void> {
    try {
      this.logger.log(`Sending password reset email to ${email}`);

      const subject = 'Reset Your Gyaani Password';
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      this.generatePasswordResetEmailHtml(resetUrl, firstName);
      this.generatePasswordResetEmailText(resetUrl, firstName);

      this.logger.log(`Password reset email would be sent to ${email}:`);
      this.logger.log(`Subject: ${subject}`);
      this.logger.log(`Reset URL: ${resetUrl}`);

      await new Promise((resolve) => setTimeout(resolve, 100));
      this.logger.log(`Password reset email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(
        'Error sending password reset email',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  private getEmailSubject(type: OtpType): string {
    switch (type) {
      case OtpType.EMAIL_VERIFICATION:
        return 'Verify Your Email - Gyaani';
      case OtpType.PHONE_VERIFICATION:
        return 'Verify Your Phone - Gyaani';
      case OtpType.PASSWORD_RESET:
        return 'Reset Your Password - Gyaani';
      case OtpType.LOGIN:
        return 'Your Login Code - Gyaani';
      default:
        return 'Your Verification Code - Gyaani';
    }
  }

  private generateOtpEmailHtml(
    otpCode: string,
    type: OtpType,
    firstName?: string,
  ): string {
    const greeting = firstName ? `Hi ${firstName}` : 'Hello';
    const purpose = this.getOtpPurpose(type);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${this.getEmailSubject(type)}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { 
            background: #1f2937; 
            color: #f9fafb; 
            font-size: 32px; 
            font-weight: bold; 
            text-align: center; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px; 
            letter-spacing: 4px;
          }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Gyaani</h1>
            <p>Your Learning Companion</p>
          </div>
          <div class="content">
            <h2>${greeting}!</h2>
            <p>${purpose}</p>
            <p>Use the following code to complete your verification:</p>
            <div class="otp-code">${otpCode}</div>
            <p><strong>This code will expire in 10 minutes.</strong></p>
            <p>If you didn't request this code, please ignore this email.</p>
            <div class="footer">
              <p>© 2024 Gyaani. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateOtpEmailText(
    otpCode: string,
    type: OtpType,
    firstName?: string,
  ): string {
    const greeting = firstName ? `Hi ${firstName}` : 'Hello';
    const purpose = this.getOtpPurpose(type);

    return `
${greeting}!

${purpose}

Your verification code is: ${otpCode}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
The Gyaani Team

---
© 2024 Gyaani. All rights reserved.
This is an automated message, please do not reply.
    `;
  }

  private generateWelcomeEmailHtml(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Gyaani</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .cta-button { 
            background: #4f46e5; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            display: inline-block; 
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Gyaani!</h1>
            <p>Your Learning Journey Starts Here</p>
          </div>
          <div class="content">
            <h2>Hi ${firstName}!</h2>
            <p>Welcome to Gyaani, your personal learning companion! We're excited to have you join our community of learners.</p>
            <p>With Gyaani, you can:</p>
            <ul>
              <li>📚 Study across multiple subjects</li>
              <li>🎯 Track your progress and achievements</li>
              <li>🔥 Build and maintain study streaks</li>
              <li>🧠 Practice with interactive quizzes</li>
              <li>📱 Learn anytime, anywhere</li>
            </ul>
            <p>Ready to start your learning journey?</p>
            <a href="${process.env.FRONTEND_URL}/dashboard" class="cta-button">Get Started</a>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Happy learning!</p>
            <p><strong>The Gyaani Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateWelcomeEmailText(firstName: string): string {
    return `
Hi ${firstName}!

Welcome to Gyaani, your personal learning companion! We're excited to have you join our community of learners.

With Gyaani, you can:
- Study across multiple subjects
- Track your progress and achievements
- Build and maintain study streaks
- Practice with interactive quizzes
- Learn anytime, anywhere

Ready to start your learning journey?
Visit: ${process.env.FRONTEND_URL}/dashboard

If you have any questions, feel free to reach out to our support team.

Happy learning!

The Gyaani Team

---
© 2024 Gyaani. All rights reserved.
    `;
  }

  private generatePasswordResetEmailHtml(
    resetUrl: string,
    firstName?: string,
  ): string {
    const greeting = firstName ? `Hi ${firstName}` : 'Hello';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Gyaani</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .reset-button { 
            background: #dc2626; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            display: inline-block; 
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
            <p>Gyaani Account Security</p>
          </div>
          <div class="content">
            <h2>${greeting}!</h2>
            <p>We received a request to reset your password for your Gyaani account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="reset-button">Reset Password</a>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>For security, never share this link with anyone.</p>
            <div class="footer">
              <p>© 2024 Gyaani. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generatePasswordResetEmailText(
    resetUrl: string,
    firstName?: string,
  ): string {
    const greeting = firstName ? `Hi ${firstName}` : 'Hello';

    return `
${greeting}!

We received a request to reset your password for your Gyaani account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

For security, never share this link with anyone.

Best regards,
The Gyaani Team

---
© 2024 Gyaani. All rights reserved.
This is an automated message, please do not reply.
    `;
  }

  private getOtpPurpose(type: OtpType): string {
    switch (type) {
      case OtpType.EMAIL_VERIFICATION:
        return 'Please verify your email address to complete your account setup.';
      case OtpType.PHONE_VERIFICATION:
        return 'Please verify your phone number to secure your account.';
      case OtpType.PASSWORD_RESET:
        return 'Please use this code to reset your password.';
      case OtpType.LOGIN:
        return 'Please use this code to complete your login.';
      default:
        return 'Please use this code to complete your verification.';
    }
  }
}
