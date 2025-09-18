import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { OtpService } from '../services/otp.service';
import { 
  RegisterDto, 
  LoginDto, 
  LoginWithOtpDto, 
  ChangePasswordDto, 
  ForgotPasswordDto, 
  ResetPasswordDto,
  RequestOtpDto,
  VerifyOtpDto,
  ResendOtpDto,
} from '../dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../schemas/user.schema';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: any,
  ): Promise<ApiResponse<{ user: User; message: string }>> {
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const result = await this.authService.register(registerDto, metadata);
    
    return {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `register_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.authService.login(loginDto);
    
    return {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `login_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Public()
  @Post('login/otp')
  @HttpCode(HttpStatus.OK)
  async loginWithOtp(
    @Body() loginDto: LoginWithOtpDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.authService.loginWithOtp(loginDto);
    
    return {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `login_otp_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Public()
  @Post('request-login-otp')
  @HttpCode(HttpStatus.OK)
  async requestLoginOtp(
    @Body() body: { identifier: string },
    @Req() req: any,
  ): Promise<ApiResponse<{ message: string }>> {
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const result = await this.authService.requestLoginOtp(body.identifier, metadata);
    
    return {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `request_login_otp_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body() body: { identifier: string; otpCode: string },
  ): Promise<ApiResponse<{ user: User; message: string }>> {
    const result = await this.authService.verifyEmail(body.identifier, body.otpCode);
    
    return {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `verify_email_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ApiResponse<{ message: string }>> {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    
    return {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `forgot_password_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponse<{ message: string }>> {
    const result = await this.authService.resetPassword(resetPasswordDto);
    
    return {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `reset_password_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<{ message: string }>> {
    const result = await this.authService.changePassword(user._id.toString(), changePasswordDto);
    
    return {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `change_password_${user._id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() body: { refreshToken: string },
  ): Promise<ApiResponse<any>> {
    const result = await this.authService.refreshToken(body.refreshToken);
    
    return {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `refresh_token_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @CurrentUser() user: User,
  ): Promise<ApiResponse<User>> {
    return {
      success: true,
      data: user,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `profile_${user._id}_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Public()
  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  async requestOtp(
    @Body() requestOtpDto: RequestOtpDto,
    @Req() req: any,
  ): Promise<ApiResponse<{ message: string }>> {
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      deviceId: requestOtpDto.deviceId,
    };

    await this.otpService.createOtp(
      requestOtpDto.identifier,
      requestOtpDto.type,
      undefined,
      metadata,
    );

    // Send OTP via email (in production, also send via SMS for phone verification)
    if (requestOtpDto.type === 'email_verification' || requestOtpDto.type === 'login') {
      // This would be handled by the email service
      // For now, we'll just return success
    }

    return {
      success: true,
      data: { message: 'OTP sent successfully' },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `request_otp_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<ApiResponse<{ message: string }>> {
    await this.otpService.verifyOtp(
      verifyOtpDto.identifier,
      verifyOtpDto.code,
      verifyOtpDto.type,
    );

    return {
      success: true,
      data: { message: 'OTP verified successfully' },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `verify_otp_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }

  @Public()
  @Post('otp/resend')
  @HttpCode(HttpStatus.OK)
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
    @Req() req: any,
  ): Promise<ApiResponse<{ message: string }>> {
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    await this.otpService.resendOtp(
      resendOtpDto.identifier,
      resendOtpDto.type,
      metadata,
    );

    return {
      success: true,
      data: { message: 'OTP resent successfully' },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: `resend_otp_${Date.now()}`,
        version: '1.0.0',
      },
    };
  }
}
