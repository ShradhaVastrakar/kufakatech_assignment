import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema } from '../../utils/validation';
import { verifyOTP } from '../../utils/api';
import { ArrowLeft, Key } from 'lucide-react';
import { cn } from '../../utils/cn';

const OTPForm = ({ phoneNumber, onVerificationSuccess, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const otp = watch('otp');

  const onSubmit = useCallback(async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await verifyOTP(phoneNumber, data.otp);
      
      if (result.success) {
        onVerificationSuccess(result.user);
      } else {
        setError(result.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber, onVerificationSuccess]);

  useEffect(() => {
    if (otp && otp.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [otp, handleSubmit, onSubmit]);

  const handleInputChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = (otp || '').split('');
      newOtp[index] = value;
      const otpString = newOtp.join('');
      setValue('otp', otpString);

      // Move to next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp?.[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      setValue('otp', pastedData);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verify Your Number
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We've sent a 6-digit code to
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {phoneNumber}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
            Enter the 6-digit code
          </label>
          
          <div className="flex justify-center space-x-2 mb-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                className={cn(
                  "w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                  otp?.[index] && "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                )}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          {errors.otp && (
            <p className="text-center text-sm text-red-600 dark:text-red-400">
              {errors.otp.message}
            </p>
          )}
          
          {error && (
            <p className="text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !otp || otp.length !== 6}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to phone number
        </button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Didn't receive the code?</p>
          <p className="mt-1">
            <span className="text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">
              Resend OTP
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          For demo purposes, use <strong>123456</strong> as the OTP
        </p>
      </div>
    </div>
  );
};

export default OTPForm; 