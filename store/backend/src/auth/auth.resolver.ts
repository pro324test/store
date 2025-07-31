import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import {
  LoginInput,
  RegisterInput,
  RefreshTokenInput,
  GenerateOtpInput,
  VerifyOtpInput,
} from './dto/auth.input';
import { AuthResult, TokenResult, OtpResult } from './dto/auth.response';
import { User } from '../user/user.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResult)
  async login(@Args('input') input: LoginInput): Promise<AuthResult> {
    const { phoneNumber, password } = input;
    return this.authService.login(phoneNumber, password);
  }

  @Mutation(() => AuthResult)
  async register(@Args('input') input: RegisterInput): Promise<AuthResult> {
    const { phoneNumber, password, fullName, email } = input;
    return this.authService.register(phoneNumber, password, fullName, email);
  }

  @Mutation(() => TokenResult)
  async refreshTokens(
    @Args('input') input: RefreshTokenInput,
  ): Promise<TokenResult> {
    const { refreshToken } = input;
    return this.authService.refreshTokens(refreshToken);
  }

  @Mutation(() => OtpResult)
  async generateOtp(
    @Args('input') input: GenerateOtpInput,
  ): Promise<OtpResult> {
    const { phoneNumber, type } = input;

    try {
      const otpCode = await this.authService.generateOtp(phoneNumber, type);

      // In a real application, you would send this OTP via SMS
      // For development, we'll return success
      console.log(`OTP for ${phoneNumber}: ${otpCode}`);

      return {
        success: true,
        message: `OTP sent to ${phoneNumber}`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send OTP',
      };
    }
  }

  @Mutation(() => OtpResult)
  async verifyOtp(@Args('input') input: VerifyOtpInput): Promise<OtpResult> {
    const { phoneNumber, otpCode, type } = input;

    const isValid = await this.authService.verifyOtp(
      phoneNumber,
      otpCode,
      type,
    );

    return {
      success: isValid,
      message: isValid ? 'OTP verified successfully' : 'Invalid or expired OTP',
    };
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@Context() context): Promise<User> {
    return context.req.user;
  }
}
