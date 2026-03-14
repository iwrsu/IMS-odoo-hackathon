'use client';

import { useInventory } from '@/lib/contexts/inventory-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, AlertTriangle, DollarSign, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { stats, products } = useInventory();

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-900',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: 'bg-yellow-900',
      iconColor: 'text-yellow-400',
    },
    {
      title: 'Inventory Value',
      value: `$${stats.totalInventoryValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-green-900',
      iconColor: 'text-green-400',
    },
    {
      title: 'Documents In Progress',
      value: stats.documentsInProgress,
      icon: FileText,
      color: 'bg-purple-900',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here's your inventory overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-slate-700 bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-white text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} className={stat.iconColor} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      {stats.lowStockProducts > 0 && (
        <Alert className="border-yellow-900 bg-yellow-950">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200 ml-2">
            {stats.lowStockProducts} product{stats.lowStockProducts !== 1 ? 's' : ''} running low on stock. Consider reordering.
          </AlertDescription>
        </Alert>
      )}

      {/* Low Stock Products */}
      {stats.lowStockProducts > 0 && (
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Low Stock Products</CardTitle>
            <CardDescription className="text-slate-400">
              Products that need reordering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products
                .filter((p) => p.status === 'low-stock' || p.status === 'out-of-stock')
                .slice(0, 5)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-xs text-slate-400">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        product.status === 'out-of-stock' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {product.quantityOnHand} units
                      </p>
                      <p className="text-xs text-slate-400">Reorder: {product.reorderLevel}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Inventory Overview</CardTitle>
          <CardDescription className="text-slate-400">
            Current status of your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-400 text-sm">In Stock</p>
              <p className="text-white text-2xl font-bold mt-2">
                {products.filter((p) => p.status === 'in-stock').length}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Low Stock</p>
              <p className="text-yellow-400 text-2xl font-bold mt-2">
                {products.filter((p) => p.status === 'low-stock').length}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Out of Stock</p>
              <p className="text-red-400 text-2xl font-bold mt-2">
                {products.filter((p) => p.status === 'out-of-stock').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
