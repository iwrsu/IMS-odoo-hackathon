'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Settings, AlertTriangle } from 'lucide-react';

const WAREHOUSES = [
  { id: 1, name: 'Main Warehouse', location: 'Downtown', manager: 'John Smith', capacity: 10000 },
  { id: 2, name: 'Secondary Warehouse', location: 'Industrial Park', manager: 'Jane Doe', capacity: 5000 },
  { id: 3, name: 'Distribution Center', location: 'Port Area', manager: 'Mike Johnson', capacity: 20000 },
  { id: 4, name: 'Local Branch', location: 'Uptown', manager: 'Sarah Williams', capacity: 2000 },
];

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and warehouse settings</p>
      </div>

      {/* User Profile */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="text-blue-400" size={24} />
            <div>
              <CardTitle className="text-white">User Profile</CardTitle>
              <CardDescription className="text-slate-400">Your account information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                  <Input
                    value={user.name}
                    disabled
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <Input
                    value={user.email}
                    disabled
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                  <Input
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    disabled
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Warehouse
                  </label>
                  <Input
                    value={user.warehouse || 'N/A'}
                    disabled
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <p className="text-sm text-slate-400 pt-2">
                Profile information is read-only. Contact your administrator to make changes.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Warehouse Management */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="text-purple-400" size={24} />
            <div>
              <CardTitle className="text-white">Warehouse Locations</CardTitle>
              <CardDescription className="text-slate-400">
                Configured warehouses in your system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {WAREHOUSES.map((warehouse) => (
              <div
                key={warehouse.id}
                className="p-4 bg-slate-700 rounded-lg border border-slate-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{warehouse.name}</h3>
                    <p className="text-slate-400 text-sm">{warehouse.location}</p>
                  </div>
                  <span className="text-xs bg-blue-900 text-blue-300 px-3 py-1 rounded-full">
                    Capacity: {warehouse.capacity.toLocaleString()} units
                  </span>
                </div>
                <p className="text-slate-400 text-sm">Manager: {warehouse.manager}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-amber-400" size={24} />
            <div>
              <CardTitle className="text-white">System Information</CardTitle>
              <CardDescription className="text-slate-400">
                Application details and support
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Application
              </label>
              <p className="text-white">CoreInventory IMS v1.0</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Environment
              </label>
              <p className="text-white">Production</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Data Storage
              </label>
              <p className="text-white">Local Browser Storage</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Last Updated
              </label>
              <p className="text-white">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <Alert className="border-blue-900 bg-blue-950 mt-4">
            <AlertDescription className="text-blue-200">
              This is a demo application with mock data. All data is stored locally in your browser.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Data Management</CardTitle>
          <CardDescription className="text-slate-400">
            Export or clear your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => {
              const data = localStorage.getItem('inventory-data');
              if (data) {
                const element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
                element.setAttribute('download', 'inventory-backup.json');
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Export Data
          </Button>
          <p className="text-sm text-slate-400">
            Download your inventory data as a backup file.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
