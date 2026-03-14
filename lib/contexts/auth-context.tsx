'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { roleDashboardPath } from '@/lib/auth/roles';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  requestOtp: (email: string, role?: User['role']) => Promise<void>;
  verifyOtp: (email: string, otp: string, role?: User['role']) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  roleHomePath: string;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/me', { method: 'GET', cache: 'no-store' });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setUser(null);
        return;
      }

      setUser(result.data.user || null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const requestOtp = useCallback(async (email: string, role?: User['role']) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Failed to send OTP');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string, role?: User['role']) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, role }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'OTP verification failed');
      }

      setUser(result.data.user || null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const roleHomePath = user ? roleDashboardPath[user.role] : '/dashboard';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        requestOtp,
        verifyOtp,
        logout,
        refreshUser,
        roleHomePath,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
