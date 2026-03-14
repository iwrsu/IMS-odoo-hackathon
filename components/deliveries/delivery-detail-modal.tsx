'use client';

import { Delivery } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface DeliveryDetailModalProps {
  delivery: Delivery | null;
  onClose: () => void;
}

export default function DeliveryDetailModal({ delivery, onClose }: DeliveryDetailModalProps) {
  if (!delivery) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-white">Delivery Details</CardTitle>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Delivery Number</p>
              <p className="text-white font-mono">{delivery.deliveryNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Status</p>
              <p className={`text-sm font-medium capitalize ${
                delivery.status === 'confirmed' || delivery.status === 'shipped'
                  ? 'text-green-400'
                  : delivery.status === 'pending'
                  ? 'text-yellow-400'
                  : delivery.status === 'cancelled'
                  ? 'text-red-400'
                  : 'text-slate-400'
              }`}>
                {delivery.status}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <p className="text-slate-400 text-sm mb-2">Customer</p>
            <p className="text-white">{delivery.customer}</p>
          </div>

          <div>
            <p className="text-slate-400 text-sm mb-3">Items</p>
            <div className="space-y-2">
              {delivery.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-slate-700 p-2 rounded text-sm"
                >
                  <div>
                    <p className="text-white font-medium">{item.productSku}</p>
                    <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white font-medium">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
            <p className="text-slate-400 font-medium">Total Amount</p>
            <p className="text-white text-xl font-bold">${delivery.totalAmount.toFixed(2)}</p>
          </div>

          {delivery.notes && (
            <div className="border-t border-slate-700 pt-4">
              <p className="text-slate-400 text-sm mb-2">Notes</p>
              <p className="text-slate-300 text-sm">{delivery.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
