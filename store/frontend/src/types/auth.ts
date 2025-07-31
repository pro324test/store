export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  email?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  roles: UserRole[];
}

export interface UserRole {
  role: Role;
  isActive: boolean;
  isPrimary: boolean;
  createdAt: string;
}

export enum Role {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  SYSTEM_STAFF = 'SYSTEM_STAFF',
  DELIVERY_PERSON = 'DELIVERY_PERSON'
}

export enum OTPType {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  phoneNumber: string;
  password: string;
}

export interface RegisterInput {
  phoneNumber: string;
  password: string;
  fullName: string;
  email?: string;
}

export interface OTPInput {
  phoneNumber: string;
  type: OTPType;
}

export interface VerifyOTPInput {
  phoneNumber: string;
  otpCode: string;
  type: OTPType;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface UpdateProfileInput {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  generateOTP: (input: OTPInput) => Promise<OTPResponse>;
  verifyOTP: (input: VerifyOTPInput) => Promise<OTPResponse>;
  refreshTokens: () => Promise<void>;
  updateUserProfile: (userId: string, input: UpdateProfileInput) => Promise<void>;
}