'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { canAccessPath } from '@/lib/auth/roles';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, roleHomePath } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!user) return;

    if (pathname === '/dashboard') {
      router.replace(roleHomePath);
      return;
    }

    if (!canAccessPath(user.role, pathname)) {
      router.replace(roleHomePath);
    }
  }, [isAuthenticated, isLoading, pathname, roleHomePath, router, user]);

  if (!mounted || isLoading || !isAuthenticated || !user || pathname === '/dashboard') {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar/>
      <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
