'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Inbox,
  Truck,
  ArrowRight,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    label: 'Products',
    href: '/dashboard/products',
    icon: Package,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    label: 'Receipts',
    href: '/dashboard/receipts',
    icon: Inbox,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    label: 'Deliveries',
    href: '/dashboard/deliveries',
    icon: Truck,
    roles: ['admin', 'manager'],
  },
  {
    label: 'Transfers',
    href: '/dashboard/transfers',
    icon: ArrowRight,
    roles: ['admin', 'manager'],
  },
  {
    label: 'Adjustments',
    href: '/dashboard/adjustments',
    icon: Plus,
    roles: ['admin'],
  },
  {
    label: 'Ledger',
    href: '/dashboard/ledger',
    icon: LayoutDashboard,
    roles: ['admin'],
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['admin'],
  },
];

export default function Sidebar({ role }:{ role?:string}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, roleHomePath } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const resolvedMenuItems = menuItems.map((item) =>
    item.label === 'Dashboard' ? { ...item, href: roleHomePath } : item
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-800 border-r border-slate-700 p-6 overflow-y-auto transition-transform duration-300 lg:relative lg:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 mt-8 lg:mt-0">
          <h1 className="text-xl font-bold text-white">CoreInventory</h1>
          <p className="text-xs text-slate-400 mt-1">IMS</p>
        </div>

        {user && (
          <div className="mb-6 p-3 bg-slate-700 rounded-lg">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-slate-300 capitalize">{user.role}</p>
          </div>
        )}

        <nav className="space-y-2 mb-8">
          {resolvedMenuItems
          .filter((item) => item.roles.includes(user?.role || ''))
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-700 pt-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
