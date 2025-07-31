import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        phoneNumber
        fullName
        email
        isActive
        lastLoginAt
        createdAt
        roles {
          role
          isActive
          isPrimary
          createdAt
        }
      }
      accessToken
      refreshToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        phoneNumber
        fullName
        email
        isActive
        lastLoginAt
        createdAt
        roles {
          role
          isActive
          isPrimary
          createdAt
        }
      }
      accessToken
      refreshToken
    }
  }
`;

export const GENERATE_OTP_MUTATION = gql`
  mutation GenerateOTP($input: GenerateOtpInput!) {
    generateOtp(input: $input) {
      success
      message
    }
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOTP($input: VerifyOtpInput!) {
    verifyOtp(input: $input) {
      success
      message
    }
  }
`;

export const REFRESH_TOKENS_MUTATION = gql`
  mutation RefreshTokens($input: RefreshTokensInput!) {
    refreshTokens(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      phoneNumber
      fullName
      email
      isActive
      lastLoginAt
      createdAt
      roles {
        role
        isActive
        isPrimary
        createdAt
      }
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($userId: Int!, $input: UpdateProfileInput!) {
    updateProfile(userId: $userId, input: $input) {
      id
      phoneNumber
      fullName
      email
      isActive
      lastLoginAt
      createdAt
      updatedAt
      roles {
        role
        isActive
        isPrimary
        createdAt
      }
    }
  }
`;