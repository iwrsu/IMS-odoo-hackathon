'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { UserRole } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Mail, ShieldCheck, Boxes } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { requestOtp, verifyOtp, isLoading, isAuthenticated, roleHomePath } = useAuth();

  const [email, setEmail] = useState('admin@coreinventory.com');
  const [role, setRole] = useState<UserRole>('admin');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(roleHomePath);
    }
  }, [isAuthenticated, roleHomePath, router]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await requestOtp(email, role);
      setOtpRequested(true);
      setMessage('OTP sent to your email. Enter the 6-digit code to continue.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await verifyOtp(email, otp, role);
      router.replace(roleHomePath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full top-[-150px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-3xl rounded-full bottom-[-120px] right-[-100px]" />

      <Card className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/10 p-4 rounded-xl mb-3">
              <Boxes size={30} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white">StockFlow</h1>
            <p className="text-gray-400 text-sm">Inventory Management System</p>
          </div>

          {error ? (
            <Alert className="mb-4 border-red-800 bg-red-950">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          ) : null}

          {message ? (
            <Alert className="mb-4 border-blue-900 bg-blue-950">
              <AlertDescription className="text-blue-300">{message}</AlertDescription>
            </Alert>
          ) : null}

          {!otpRequested ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@coreinventory.com"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  disabled={isLoading}
                  className="w-full h-10 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
                >
                  <option value="admin" className="bg-slate-900">
                    Admin
                  </option>
                  <option value="manager" className="bg-slate-900">
                    Manager
                  </option>
                  <option value="staff" className="bg-slate-900">
                    Staff
                  </option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">OTP Code</label>
                <div className="relative">
                  <ShieldCheck size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP & Sign In'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={isLoading}
                onClick={() => {
                  setOtpRequested(false);
                  setOtp('');
                  setMessage('');
                  setError('');
                }}
                className="w-full text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Change Email / Role
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
