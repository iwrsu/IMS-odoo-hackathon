'use client';

import { useState } from 'react';
import { useInventory } from '@/lib/contexts/inventory-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Eye, Check, Trash2 } from 'lucide-react';
import ReceiptModal from '@/components/receipts/receipt-modal';
import ReceiptDetailModal from '@/components/receipts/receipt-detail-modal';
import { Receipt } from '@/lib/types';

export default function ReceiptsPage() {
  const { receipts, addReceipt, confirmReceipt, deleteReceipt } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
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
          <h1 className="text-3xl font-bold text-white">Purchase Receipts</h1>
          <p className="text-slate-400 mt-1">Manage incoming stock</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={20} className="mr-2" />
          New Receipt
        </Button>
      </div>

      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Receipts</CardTitle>
          <CardDescription className="text-slate-400">
            {receipts.length} receipts in system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {receipts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No receipts yet</p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Create First Receipt
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700 bg-slate-900">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">
                      Receipt #
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">
                      Supplier
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
                  {receipts.map((receipt) => (
                    <tr
                      key={receipt.id}
                      className="border-b border-slate-700 hover:bg-slate-700/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-300">
                        {receipt.receiptNumber}
                      </td>
                      <td className="px-4 py-3 text-white">{receipt.supplier}</td>
                      <td className="px-4 py-3 text-right text-slate-300">
                        {receipt.totalItems}
                      </td>
                      <td className="px-4 py-3 text-right text-white">
                        ${receipt.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(receipt.status)}`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedReceipt(receipt)}
                            className="text-blue-400 hover:bg-slate-700"
                          >
                            <Eye size={16} />
                          </Button>
                          {receipt.status !== 'confirmed' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => confirmReceipt(receipt.id)}
                              className="text-green-400 hover:bg-slate-700"
                            >
                              <Check size={16} />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteReceipt(receipt.id)}
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

      <ReceiptModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addReceipt} />
      <ReceiptDetailModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
