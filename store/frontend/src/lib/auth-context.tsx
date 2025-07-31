'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { 
  AuthContextType, 
  User, 
  LoginInput, 
  RegisterInput, 
  OTPInput, 
  VerifyOTPInput, 
  OTPResponse,
  UpdateProfileInput
} from '@/types/auth';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  GENERATE_OTP_MUTATION,
  VERIFY_OTP_MUTATION,
  REFRESH_TOKENS_MUTATION,
  ME_QUERY,
  UPDATE_PROFILE_MUTATION
} from '@/lib/graphql/auth';
import { apolloClient } from '@/lib/apollo-client';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [generateOTPMutation] = useMutation(GENERATE_OTP_MUTATION);
  const [verifyOTPMutation] = useMutation(VERIFY_OTP_MUTATION);
  const [refreshTokensMutation] = useMutation(REFRESH_TOKENS_MUTATION);
  const [updateProfileMutation] = useMutation(UPDATE_PROFILE_MUTATION);
  const [getMeQuery] = useLazyQuery(ME_QUERY);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken) {
        try {
          const { data } = await getMeQuery();
          if (data?.me) {
            setUser(data.me);
          } else {
            // Token might be invalid, try refresh
            if (refreshToken) {
              await refreshTokens();
            }
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // Try refresh token if available
          if (refreshToken) {
            try {
              await refreshTokens();
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [getMeQuery]); // Only depend on getMeQuery which is stable

  const login = async (input: LoginInput) => {
    try {
      const { data } = await loginMutation({
        variables: { input }
      });

      if (data?.login) {
        const { user, accessToken, refreshToken } = data.login;
        
        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Set user state
        setUser(user);
        
        // Reset Apollo cache to ensure fresh data
        apolloClient.resetStore();
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const { data } = await registerMutation({
        variables: { input }
      });

      if (data?.register) {
        const { user, accessToken, refreshToken } = data.register;
        
        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Set user state
        setUser(user);
        
        // Reset Apollo cache
        apolloClient.resetStore();
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Clear user state
    setUser(null);
    
    // Reset Apollo cache
    apolloClient.resetStore();
  };

  const generateOTP = async (input: OTPInput): Promise<OTPResponse> => {
    try {
      const { data } = await generateOTPMutation({
        variables: { input }
      });

      return data?.generateOtp || { success: false, message: 'Unknown error' };
    } catch (error) {
      console.error('Generate OTP error:', error);
      throw error;
    }
  };

  const verifyOTP = async (input: VerifyOTPInput): Promise<OTPResponse> => {
    try {
      const { data } = await verifyOTPMutation({
        variables: { input }
      });

      return data?.verifyOtp || { success: false, message: 'Unknown error' };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  };

  const refreshTokens = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data } = await refreshTokensMutation({
        variables: { input: { refreshToken } }
      });

      if (data?.refreshTokens) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.refreshTokens;
        
        // Store new tokens
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Get updated user data
        const { data: userData } = await getMeQuery();
        if (userData?.me) {
          setUser(userData.me);
        }
      }
    } catch (error) {
      console.error('Refresh tokens error:', error);
      logout();
      throw error;
    }
  };

  const updateUserProfile = async (userId: string, input: UpdateProfileInput) => {
    try {
      const { data } = await updateProfileMutation({
        variables: { 
          userId: parseInt(userId), 
          input 
        }
      });

      if (data?.updateProfile) {
        setUser(data.updateProfile);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    generateOTP,
    verifyOTP,
    refreshTokens,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}