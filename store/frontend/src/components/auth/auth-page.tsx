'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { OTPVerification } from './otp-verification';
import { OTPType } from '@/types/auth';

type AuthMode = 'login' | 'register' | 'otp';

interface AuthPageProps {
  defaultMode?: AuthMode;
}

export function AuthPage({ defaultMode = 'login' }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const router = useRouter();
  const [otpData, setOtpData] = useState<{
    phoneNumber: string;
    type: OTPType;
  } | null>(null);

  const handleSwitchToRegister = () => setMode('register');
  const handleSwitchToLogin = () => setMode('login');
  
  const handleSwitchToOTP = () => {
    // For now, we'll use a placeholder phone number
    // In a real app, you might want to collect this first
    setOtpData({
      phoneNumber: '+218911234567', // This would come from a form
      type: OTPType.LOGIN
    });
    setMode('otp');
  };

  const handleOTPBack = () => {
    setMode('login');
    setOtpData(null);
  };

  const handleOTPSuccess = () => {
    // OTP verified successfully - redirect to dashboard
    console.log('OTP verified successfully');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <LoginForm
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToOTP={handleSwitchToOTP}
          />
        )}
        
        {mode === 'register' && (
          <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
        )}
        
        {mode === 'otp' && otpData && (
          <OTPVerification
            phoneNumber={otpData.phoneNumber}
            otpType={otpData.type}
            onBack={handleOTPBack}
            onSuccess={handleOTPSuccess}
          />
        )}
      </div>
    </div>
  );
}