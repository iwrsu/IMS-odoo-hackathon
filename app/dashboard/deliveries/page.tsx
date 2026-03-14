'use client';

import { useState } from 'react';
import { useInventory } from '@/lib/contexts/inventory-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Eye, Check, Trash2 } from 'lucide-react';
import DeliveryModal from '@/components/deliveries/delivery-modal';
import DeliveryDetailModal from '@/components/deliveries/delivery-detail-modal';
import { Delivery } from '@/lib/types';

export default function DeliveriesPage() {
  const { deliveries, addDelivery, confirmDelivery, deleteDelivery } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'shipped':
        return 'bg-green-900/50 text-green-300';
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'draft':
        return 'bg-slate-700 text-slate-300';
      case 'cancelled':
        return 'bg-red-900/50 text-red-300';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Deliveries</h1>
          <p className="text-slate-400 mt-1">Manage outgoing shipments</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={20} className="mr-2" />
          New Delivery
        </Button>
      </div>

      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Deliveries</CardTitle>
          <CardDescription className="text-slate-400">
            {deliveries.length} deliveries in system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deliveries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No deliveries yet</p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Create First Delivery
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700 bg-slate-900">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">
                      Delivery #
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">
                      Customer
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-300">Items</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-300">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      className="border-b border-slate-700 hover:bg-slate-700/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-300">
                        {delivery.deliveryNumber}
                      </td>
                      <td className="px-4 py-3 text-white">{delivery.customer}</td>
                      <td className="px-4 py-3 text-right text-slate-300">
                        {delivery.totalItems}
                      </td>
                      <td className="px-4 py-3 text-right text-white">
                        ${delivery.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedDelivery(delivery)}
                            className="text-blue-400 hover:bg-slate-700"
                          >
                            <Eye size={16} />
                          </Button>
                          {delivery.status !== 'confirmed' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => confirmDelivery(delivery.id)}
                              className="text-green-400 hover:bg-slate-700"
                            >
                              <Check size={16} />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteDelivery(delivery.id)}
                            className="text-red-400 hover:bg-slate-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeliveryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addDelivery} />
      <DeliveryDetailModal
        delivery={selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
      />
    </div>
  );
}
