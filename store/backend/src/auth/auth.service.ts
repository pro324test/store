import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: number;
  phoneNumber: string;
  roles: UserRole[];
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  user: User & { roles: any[] };
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Get user roles
    const userRoles = await this.prisma.userRoleAssignment.findMany({
      where: { userId: user.id, isActive: true },
      select: { role: true },
    });

    const roles = userRoles.map((ur) => ur.role);

    const payload: JwtPayload = {
      sub: user.id,
      phoneNumber: user.phoneNumber,
      roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '7d'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async validateUser(
    phoneNumber: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
      include: {
        roles: {
          where: { isActive: true },
          include: {
            user: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(phoneNumber: string, password: string): Promise<AuthResult> {
    const user = await this.validateUser(phoneNumber, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Get full user with roles for response
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          where: { isActive: true },
        },
      },
    });

    return {
      user: fullUser!,
      ...tokens,
    };
  }

  async register(
    phoneNumber: string,
    password: string,
    fullName: string,
    email?: string,
  ): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingUser) {
      throw new BadRequestException(
        'User with this phone number already exists',
      );
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user with customer role by default
    const user = await this.prisma.user.create({
      data: {
        phoneNumber,
        passwordHash,
        fullName,
        email,
        roles: {
          create: {
            role: UserRole.CUSTOMER,
            isActive: true,
            isPrimary: true,
          },
        },
      },
      include: {
        roles: {
          where: { isActive: true },
        },
      },
    });

    // Create customer profile
    await this.prisma.customerProfile.create({
      data: {
        userId: user.id,
      },
    });

    const tokens = await this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          roles: {
            where: { isActive: true },
          },
        },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateOtp(
    phoneNumber: string,
    type: string = 'REGISTER',
  ): Promise<string> {
    const otpLength = this.configService.get('OTP_LENGTH', 6);
    const otpCode = Math.random().toString().substr(2, otpLength);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous OTPs
    await this.prisma.otpVerification.updateMany({
      where: {
        phoneNumber,
        type,
        isVerified: false,
      },
      data: {
        isVerified: true, // Mark as used to invalidate
      },
    });

    // Create new OTP
    await this.prisma.otpVerification.create({
      data: {
        phoneNumber,
        otpCode,
        type,
        expiresAt,
      },
    });

    return otpCode;
  }

  async sendOtp(
    phoneNumber: string,
    type: string = 'REGISTER',
  ): Promise<boolean> {
    try {
      const otpCode = await this.generateOtp(phoneNumber, type);

      // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
      // For now, just log the OTP for development
      console.log(`OTP for ${phoneNumber}: ${otpCode}`);

      // In production, replace this with actual SMS sending logic:
      // await this.smsService.sendSms(phoneNumber, `Your OTP code is: ${otpCode}`);

      return true;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return false;
    }
  }

  async verifyOtp(
    phoneNumber: string,
    otpCode: string,
    type: string = 'REGISTER',
  ): Promise<boolean> {
    const otp = await this.prisma.otpVerification.findFirst({
      where: {
        phoneNumber,
        otpCode,
        type,
        isVerified: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otp) {
      return false;
    }

    // Mark as verified
    await this.prisma.otpVerification.update({
      where: { id: otp.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      },
    });

    return true;
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          where: { isActive: true },
        },
      },
    });
  }
}
