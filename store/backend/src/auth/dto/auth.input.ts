import { InputType, Field } from '@nestjs/graphql';
import {
  IsPhoneNumber,
  IsString,
  MinLength,
  IsOptional,
  IsEmail,
} from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsPhoneNumber('LY', {
    message: 'Please provide a valid Libyan phone number',
  })
  phoneNumber: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsPhoneNumber('LY', {
    message: 'Please provide a valid Libyan phone number',
  })
  phoneNumber: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field()
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;
}

@InputType()
export class RefreshTokenInput {
  @Field()
  @IsString()
  refreshToken: string;
}

@InputType()
export class GenerateOtpInput {
  @Field()
  @IsPhoneNumber('LY', {
    message: 'Please provide a valid Libyan phone number',
  })
  phoneNumber: string;

  @Field()
  @IsString()
  type: string; // REGISTER, LOGIN, PASSWORD_RESET
}

@InputType()
export class VerifyOtpInput {
  @Field()
  @IsPhoneNumber('LY', {
    message: 'Please provide a valid Libyan phone number',
  })
  phoneNumber: string;

  @Field()
  @IsString()
  otpCode: string;

  @Field()
  @IsString()
  type: string; // REGISTER, LOGIN, PASSWORD_RESET
}
