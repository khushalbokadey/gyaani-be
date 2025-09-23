import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserStatus } from '../schemas/user.schema';
import { OtpService } from './otp.service';
import { EmailService } from './email.service';
import { PhoneService } from './phone.service';
import { RegisterDto, PhoneRegisterDto, PhoneLoginDto, LoginDto, LoginWithOtpDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from '../dto';
import { LoggerService } from '../../core/logging/logger.service';
import { ConflictError as CustomConflictError, ValidationError as CustomValidationError, NotFoundError as CustomNotFoundError } from '../../shared/errors/application.error';

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface JwtPayload {
  sub: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly phoneService: PhoneService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto, metadata?: any): Promise<{ user: User; message: string }> {
    try {
      this.logger.log(`Registering new user: ${registerDto.email}`);

      // Check if user already exists
      const existingUser = await this.userModel.findOne({
        $or: [
          { email: registerDto.email },
          { phoneNumber: registerDto.phoneNumber },
        ],
      });

      if (existingUser) {
        if (existingUser.email === registerDto.email) {
          throw new CustomConflictError('User with this email already exists');
        }
        if (existingUser.phoneNumber === registerDto.phoneNumber) {
          throw new CustomConflictError('User with this phone number already exists');
        }
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

      // Create user
      const user = new this.userModel({
        ...registerDto,
        password: hashedPassword,
        status: UserStatus.PENDING,
        progress: {
          totalSubjects: 0,
          completedSubjects: 0,
          totalTopics: 0,
          completedTopics: 0,
          overallProgress: 0,
        },
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'en',
          timezone: 'UTC',
        },
      });

      const savedUser = await user.save();

      // Generate email verification OTP
      const otp = await this.otpService.createOtp(
        registerDto.email,
        'email_verification' as any,
        savedUser._id.toString(),
        metadata,
      );

      // Send verification email
      await this.emailService.sendOtpEmail(
        registerDto.email,
        otp.code,
        'email_verification' as any,
        registerDto.firstName,
      );

      this.logger.log(`User registered successfully: ${savedUser._id}`);

      return {
        user: savedUser,
        message: 'Registration successful. Please check your email for verification code.',
      };
    } catch (error) {
      this.logger.error('Error registering user', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Register a new user with phone number only
   */
  async registerWithPhone(registerDto: PhoneRegisterDto, metadata?: any): Promise<{ user: User; message: string }> {
    try {
      this.logger.log(`Registering new user with phone: ${registerDto.phoneNumber}`);

      // Check if user already exists
      const existingUser = await this.userModel.findOne({
        phoneNumber: registerDto.phoneNumber,
      });

      if (existingUser) {
        throw new CustomConflictError('User with this phone number already exists');
      }

      // Generate a temporary password (user will use OTP for login)
      const tempPassword = this.generateTempPassword();
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

      // Create user
      const user = new this.userModel({
        ...registerDto,
        password: hashedPassword,
        status: UserStatus.PENDING,
        isPhoneVerified: false,
        progress: {
          totalSubjects: 0,
          completedSubjects: 0,
          totalTopics: 0,
          completedTopics: 0,
          overallProgress: 0,
        },
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'en',
          timezone: 'UTC',
        },
      });

      const savedUser = await user.save();

      // Generate phone verification OTP
      const otp = await this.otpService.createOtp(
        registerDto.phoneNumber,
        'phone_verification' as any,
        savedUser._id.toString(),
        metadata,
      );

      // Send verification SMS
      await this.phoneService.sendOtpSms(
        registerDto.phoneNumber,
        otp.code,
        'phone_verification',
        registerDto.firstName,
      );

      this.logger.log(`User registered with phone successfully: ${savedUser._id}`);

      return {
        user: savedUser,
        message: 'Registration successful. Please check your phone for verification code.',
      };
    } catch (error) {
      this.logger.error('Error registering user with phone', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Login with phone number and OTP
   */
  async loginWithPhone(loginDto: PhoneLoginDto): Promise<AuthResult> {
    try {
      this.logger.log(`Phone login attempt for: ${loginDto.phoneNumber}`);

      // Verify OTP
      await this.otpService.verifyOtp(
        loginDto.phoneNumber,
        loginDto.otpCode,
        'phone_login' as any,
      );

      // Find user
      const user = await this.userModel.findOne({
        phoneNumber: loginDto.phoneNumber,
      });

      if (!user) {
        throw new CustomNotFoundError('User not found');
      }

      // Check if user is active
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Account is not active. Please verify your phone number first.');
      }

      // Update last login
      await this.userModel.findByIdAndUpdate(user._id, {
        lastLoginAt: new Date(),
      });

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`User logged in with phone successfully: ${user._id}`);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      this.logger.error('Error during phone login', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Verify phone number with OTP
   */
  async verifyPhone(phoneNumber: string, otpCode: string): Promise<{ user: User; message: string }> {
    try {
      this.logger.log(`Phone verification attempt for: ${phoneNumber}`);

      // Verify OTP
      await this.otpService.verifyOtp(phoneNumber, otpCode, 'phone_verification' as any);

      // Find and update user
      const user = await this.userModel.findOneAndUpdate(
        { phoneNumber },
        {
          isPhoneVerified: true,
          status: UserStatus.ACTIVE,
        },
        { new: true },
      );

      if (!user) {
        throw new CustomNotFoundError('User not found');
      }

      // Send welcome SMS
      await this.phoneService.sendWelcomeSms(user.phoneNumber, user.firstName);

      this.logger.log(`Phone verified successfully for: ${phoneNumber}`);

      return {
        user,
        message: 'Phone number verified successfully. Welcome to Gyaani!',
      };
    } catch (error) {
      this.logger.error('Error verifying phone', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Request OTP for phone login
   */
  async requestPhoneLoginOtp(phoneNumber: string, metadata?: any): Promise<{ message: string }> {
    try {
      this.logger.log(`Requesting phone login OTP for: ${phoneNumber}`);

      // Check if user exists
      const user = await this.userModel.findOne({
        phoneNumber,
      });

      if (!user) {
        throw new CustomNotFoundError('User not found');
      }

      // Generate OTP
      const otp = await this.otpService.createOtp(
        phoneNumber,
        'phone_login' as any,
        user._id.toString(),
        metadata,
      );

      // Send OTP SMS
      await this.phoneService.sendOtpSms(
        phoneNumber,
        otp.code,
        'phone_login',
        user.firstName,
      );

      this.logger.log(`Phone login OTP sent successfully to: ${phoneNumber}`);

      return {
        message: 'OTP sent successfully. Please check your phone.',
      };
    } catch (error) {
      this.logger.error('Error requesting phone login OTP', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Generate temporary password for phone registration
   */
  private generateTempPassword(): string {
    // Generate a random password that user won't need to know
    // since they'll use OTP for login
    return Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
  }

  /**
   * Login with email/phone and password
   */
  async login(loginDto: LoginDto): Promise<AuthResult> {
    try {
      this.logger.log(`Login attempt for: ${loginDto.identifier}`);

      // Find user by email or phone
      const user = await this.userModel.findOne({
        $or: [
          { email: loginDto.identifier },
          { phoneNumber: loginDto.identifier },
        ],
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user is active
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Account is not active. Please verify your email first.');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Update last login
      await this.userModel.findByIdAndUpdate(user._id, {
        lastLoginAt: new Date(),
      });

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`User logged in successfully: ${user._id}`);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      this.logger.error('Error during login', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Login with OTP
   */
  async loginWithOtp(loginDto: LoginWithOtpDto): Promise<AuthResult> {
    try {
      this.logger.log(`OTP login attempt for: ${loginDto.identifier}`);

      // Verify OTP
      await this.otpService.verifyOtp(
        loginDto.identifier,
        loginDto.otpCode,
        'login' as any,
      );

      // Find user
      const user = await this.userModel.findOne({
        $or: [
          { email: loginDto.identifier },
          { phoneNumber: loginDto.identifier },
        ],
      });

      if (!user) {
        throw new CustomNotFoundError('User not found');
      }

      // Check if user is active
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Account is not active. Please verify your email first.');
      }

      // Update last login
      await this.userModel.findByIdAndUpdate(user._id, {
        lastLoginAt: new Date(),
      });

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`User logged in with OTP successfully: ${user._id}`);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      this.logger.error('Error during OTP login', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(identifier: string, otpCode: string): Promise<{ user: User; message: string }> {
    try {
      this.logger.log(`Email verification attempt for: ${identifier}`);

      // Verify OTP
      await this.otpService.verifyOtp(identifier, otpCode, 'email_verification' as any);

      // Find and update user
      const user = await this.userModel.findOneAndUpdate(
        { email: identifier },
        {
          isEmailVerified: true,
          status: UserStatus.ACTIVE,
        },
        { new: true },
      );

      if (!user) {
        throw new CustomNotFoundError('User not found');
      }

      // Send welcome email (only if email exists)
      if (user.email) {
        await this.emailService.sendWelcomeEmail(user.email, user.firstName);
      }

      this.logger.log(`Email verified successfully for: ${identifier}`);

      return {
        user,
        message: 'Email verified successfully. Welcome to Gyaani!',
      };
    } catch (error) {
      this.logger.error('Error verifying email', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Request OTP for login
   */
  async requestLoginOtp(identifier: string, metadata?: any): Promise<{ message: string }> {
    try {
      this.logger.log(`Requesting login OTP for: ${identifier}`);

      // Check if user exists
      const user = await this.userModel.findOne({
        $or: [
          { email: identifier },
          { phoneNumber: identifier },
        ],
      });

      if (!user) {
        throw new CustomNotFoundError('User not found');
      }

      // Generate OTP
      const otp = await this.otpService.createOtp(
        identifier,
        'login' as any,
        user._id.toString(),
        metadata,
      );

      // Send OTP email
      await this.emailService.sendOtpEmail(
        identifier,
        otp.code,
        'login' as any,
        user.firstName,
      );

      this.logger.log(`Login OTP sent successfully to: ${identifier}`);

      return {
        message: 'OTP sent successfully. Please check your email.',
      };
    } catch (error) {
      this.logger.error('Error requesting login OTP', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    try {
      this.logger.log(`Password change request for user: ${userId}`);

      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new CustomNotFoundError('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new CustomValidationError('Current password is incorrect', 'currentPassword');
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);

      // Update password
      await this.userModel.findByIdAndUpdate(userId, {
        password: hashedNewPassword,
      });

      this.logger.log(`Password changed successfully for user: ${userId}`);

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      this.logger.error('Error changing password', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    try {
      this.logger.log(`Password reset request for: ${forgotPasswordDto.email}`);

      const user = await this.userModel.findOne({ email: forgotPasswordDto.email });
      if (!user) {
        // Don't reveal if user exists or not for security
        return {
          message: 'If an account with this email exists, you will receive a password reset link.',
        };
      }

      // Generate reset token
      const resetToken = this.jwtService.sign(
        { sub: user._id.toString(), email: user.email },
        { expiresIn: '1h' },
      );

      // Save reset token
      await this.userModel.findByIdAndUpdate(user._id, {
        passwordResetToken: resetToken,
        passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      // Send reset email (only if email exists)
      if (user.email) {
        await this.emailService.sendPasswordResetEmail(
          user.email,
          resetToken,
          user.firstName,
        );
      }

      this.logger.log(`Password reset email sent to: ${forgotPasswordDto.email}`);

      return {
        message: 'If an account with this email exists, you will receive a password reset link.',
      };
    } catch (error) {
      this.logger.error('Error processing forgot password', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    try {
      this.logger.log(`Password reset attempt with token`);

      // Verify token
      const payload = this.jwtService.verify(resetPasswordDto.token) as JwtPayload;
      
      const user = await this.userModel.findOne({
        _id: payload.sub,
        passwordResetToken: resetPasswordDto.token,
        passwordResetExpires: { $gt: new Date() },
      });

      if (!user) {
        throw new CustomValidationError('Invalid or expired reset token', 'token');
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, saltRounds);

      // Update password and clear reset token
      await this.userModel.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      });

      this.logger.log(`Password reset successfully for user: ${user._id}`);

      return {
        message: 'Password reset successfully',
      };
    } catch (error) {
      this.logger.error('Error resetting password', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /**
   * Generate JWT tokens
   */
  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      phoneNumber: user.phoneNumber,
      role: user.role,
      ...(user.email && { email: user.email }),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    return {
      accessToken,
      refreshToken,
      expiresAt,
    };
  }

  /**
   * Validate user from JWT payload
   */
  async validateUser(payload: JwtPayload): Promise<User | null> {
    try {
      const user = await this.userModel.findById(payload.sub);
      if (!user || user.status !== UserStatus.ACTIVE) {
        return null;
      }
      return user;
    } catch (error) {
      this.logger.error('Error validating user', error instanceof Error ? error.stack : String(error));
      return null;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }> {
    try {
      const payload = this.jwtService.verify(refreshToken) as JwtPayload;
      const user = await this.validateUser(payload);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      this.logger.error('Error refreshing token', error instanceof Error ? error.stack : String(error));
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
