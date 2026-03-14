import { UserRole } from '@/lib/types';

export const roleDashboardPath: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
  staff: '/dashboard/staff',
};

const restrictedByRole: Record<UserRole, string[]> = {
  admin: [],
  manager: ['/dashboard/adjustments', '/dashboard/settings', '/dashboard/ledger', '/dashboard/admin'],
  staff: [
    '/dashboard/adjustments',
    '/dashboard/settings',
    '/dashboard/ledger',
    '/dashboard/admin',
    '/dashboard/manager',
    '/dashboard/deliveries',
    '/dashboard/transfers',
  ],
};

export function canAccessPath(role: UserRole, pathname: string) {
  const blocked = restrictedByRole[role];
  return !blocked.some((prefix) => pathname.startsWith(prefix));
}
