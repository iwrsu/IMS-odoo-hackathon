'use client';

import { Adjustment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface AdjustmentDetailModalProps {
  adjustment: Adjustment | null;
  onClose: () => void;
}

export default function AdjustmentDetailModal({ adjustment, onClose }: AdjustmentDetailModalProps) {
  if (!adjustment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-white">Adjustment Details</CardTitle>
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
              <p className="text-slate-400 text-sm">Adjustment Number</p>
              <p className="text-white font-mono">{adjustment.adjustmentNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Type</p>
              <p className={`text-sm font-medium capitalize ${
                adjustment.type === 'increase'
                  ? 'text-green-400'
                  : adjustment.type === 'decrease'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}>
                {adjustment.type === 'write-off' ? 'Write-Off' : adjustment.type}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <p className="text-slate-400 text-sm mb-2">Reason</p>
            <p className="text-white">{adjustment.reason}</p>
          </div>

          <div>
            <p className="text-slate-400 text-sm mb-3">Items</p>
            <div className="space-y-2">
              {adjustment.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-700 p-2 rounded text-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{item.productSku}</p>
                      <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  {item.reason && (
                    <p className="text-slate-400 text-xs mt-1">Reason: {item.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <p className="text-slate-400 text-sm">Total Items</p>
            <p className="text-white text-xl font-bold">{adjustment.totalItems}</p>
          </div>

          {adjustment.notes && (
            <div className="border-t border-slate-700 pt-4">
              <p className="text-slate-400 text-sm mb-2">Notes</p>
              <p className="text-slate-300 text-sm">{adjustment.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
