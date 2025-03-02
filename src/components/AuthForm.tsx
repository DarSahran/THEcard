import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, CreditCard, User, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulating OTP sending with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('OTP sent successfully! Please check your registered mobile number.');
      setShowOtpInput(true);
      setOtpAttempts(prev => prev + 1);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (otpAttempts >= 3) {
      setError('Maximum OTP attempts reached. Please try again after some time.');
      return;
    }
    await handleSendOtp();
  };

  const validateAadhaar = (aadhaar: string) => {
    // Basic Aadhaar validation (Verhoeff algorithm can be implemented for proper validation)
    return /^\d{12}$/.test(aadhaar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'signup') {
        if (!fullName || !aadhaarNumber) {
          throw new Error('Please fill in all required fields');
        }

        if (!validateAadhaar(aadhaarNumber)) {
          throw new Error('Please enter a valid 12-digit Aadhaar number');
        }

        if (showOtpInput && (!otp || otp.length !== 6)) {
          throw new Error('Please enter a valid 6-digit OTP');
        }

        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: fullName,
              aadhaar_number: aadhaarNumber,
              aadhaar_verified: true,
              updated_at: new Date().toISOString(),
            });

          if (profileError) throw profileError;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
          {message}
        </div>
      )}

      {type === 'signup' && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="mt-1 relative">
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-10"
              required
            />
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-10"
            required
          />
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-10"
            required
          />
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {type === 'signup' && (
        <>
          <div>
            <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
              Aadhaar Number
            </label>
            <div className="mt-1 relative">
              <input
                id="aadhaar"
                type="text"
                value={aadhaarNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 12) {
                    setAadhaarNumber(value);
                    setShowOtpInput(false);
                    setOtp('');
                  }
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                required
                maxLength={12}
                pattern="\d{12}"
                title="Please enter a valid 12-digit Aadhaar number"
                placeholder="XXXX XXXX XXXX"
              />
              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {!showOtpInput && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || aadhaarNumber.length !== 12}
                className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send OTP'}
              </button>
            )}
          </div>

          {showOtpInput && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      setOtp(value);
                    }
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  maxLength={6}
                  pattern="\d{6}"
                  placeholder="Enter 6-digit OTP"
                />
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={loading || otpAttempts >= 3}
                    className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP {otpAttempts > 0 && `(${3 - otpAttempts} attempts left)`}
                  </button>
                  {otpAttempts >= 3 && (
                    <span className="text-xs text-red-600">
                      Maximum attempts reached
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <button
        type="submit"
        disabled={loading || (type === 'signup' && (!showOtpInput || !otp || otp.length !== 6))}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          type === 'login' ? 'Sign In' : 'Sign Up'
        )}
      </button>
    </form>
  );
}