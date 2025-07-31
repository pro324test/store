'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';
import { OTPType } from '@/types/auth';

interface OTPVerificationProps {
  phoneNumber: string;
  otpType: OTPType;
  onBack?: () => void;
  onSuccess?: () => void;
}

export function OTPVerification({ phoneNumber, otpType, onBack, onSuccess }: OTPVerificationProps) {
  const { generateOTP, verifyOTP } = useAuth();
  const t = useTranslations('auth');
  const [loading, setLoading] = useState(false);
  const [generatingOTP, setGeneratingOTP] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');

  const handleGenerateOTP = async () => {
    setGeneratingOTP(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await generateOTP({
        phoneNumber,
        type: otpType
      });

      if (result.success) {
        setSuccess(result.message || 'OTP sent successfully');
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Generate OTP error:', error);
      setError(t('otp_generate_error') || 'Failed to generate OTP');
    } finally {
      setGeneratingOTP(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await verifyOTP({
        phoneNumber,
        otpCode: otpCode.trim(),
        type: otpType
      });

      if (result.success) {
        setSuccess(result.message || 'OTP verified successfully');
        if (onSuccess) {
          setTimeout(onSuccess, 1000); // Give user time to see success message
        }
      } else {
        setError(result.message || 'Invalid OTP code');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError(t('otp_verify_error') || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (otpType) {
      case OTPType.REGISTER:
        return t('verify_registration') || 'Verify Registration';
      case OTPType.LOGIN:
        return t('verify_login') || 'Verify Login';
      case OTPType.PASSWORD_RESET:
        return t('verify_password_reset') || 'Verify Password Reset';
      default:
        return t('verify_otp') || 'Verify OTP';
    }
  };

  const getDescription = () => {
    const baseText = t('otp_sent_description') || 'Enter the 6-digit code sent to';
    return `${baseText} ${phoneNumber}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || success) && (
          <div className={`p-3 text-sm border rounded-md ${
            error 
              ? 'text-red-600 bg-red-50 border-red-200'
              : 'text-green-600 bg-green-50 border-green-200'
          }`}>
            {error || success}
          </div>
        )}

        {!success && (
          <>
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleGenerateOTP}
                disabled={generatingOTP}
                className="w-full"
              >
                {generatingOTP 
                  ? (t('sending_otp') || 'Sending OTP...') 
                  : (t('send_otp') || 'Send OTP Code')
                }
              </Button>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('otp_code') || 'OTP Code'}
                </label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={loading}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {t('otp_instructions') || 'Enter the 6-digit code from your SMS'}
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !otpCode || otpCode.length !== 6}>
                {loading ? (t('verifying') || 'Verifying...') : (t('verify') || 'Verify')}
              </Button>
            </form>
          </>
        )}

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={onBack}
            disabled={loading || generatingOTP}
          >
            {t('back') || 'Back'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}