'use client';

import { useState } from 'react';
import { useInventory } from '@/lib/contexts/inventory-context';
import { Transfer, TransferItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Trash2 } from 'lucide-react';

const WAREHOUSES = [
  'Main Warehouse',
  'Secondary Warehouse',
  'Distribution Center',
  'Local Branch',
];

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transfer: Omit<Transfer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
}

export default function TransferModal({ isOpen, onClose, onSubmit }: TransferModalProps) {
  const { products } = useInventory();
  const [transferNumber, setTransferNumber] = useState(`TRF-${Date.now().toString().slice(-6)}`);
  const [fromWarehouse, setFromWarehouse] = useState('');
  const [toWarehouse, setToWarehouse] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<TransferItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(0);

  const addItem = () => {
    if (!selectedProductId || quantity <= 0) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    if (product.quantityOnHand < quantity) {
      alert(`Insufficient stock. Available: ${product.quantityOnHand}`);
      return;
    }

    const newItem: TransferItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      productSku: product.sku,
      quantity: Number(quantity),
    };

    setItems([...items, newItem]);
    setSelectedProductId('');
    setQuantity(0);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromWarehouse || !toWarehouse || fromWarehouse === toWarehouse || items.length === 0) {
      alert('Please fill all fields and select different warehouses');
      return;
    }

    try {
      await onSubmit({
        transferNumber,
        fromWarehouse,
        toWarehouse,
        status: 'draft',
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        items,
        notes,
      });

      setTransferNumber(`TRF-${Date.now().toString().slice(-6)}`);
      setFromWarehouse('');
      setToWarehouse('');
      setNotes('');
      setItems([]);
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create transfer');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 max-h-screen overflow-y-auto">
      <Card className="w-full max-w-2xl border-slate-700 bg-slate-800 my-8">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-white">Create New Transfer</CardTitle>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Transfer Number
                </label>
                <Input
                  value={transferNumber}
                  onChange={(e) => setTransferNumber(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  From Warehouse
                </label>
                <select
                  value={fromWarehouse}
                  onChange={(e) => setFromWarehouse(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select warehouse</option>
                  {WAREHOUSES.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  To Warehouse
                </label>
                <select
                  value={toWarehouse}
                  onChange={(e) => setToWarehouse(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select warehouse</option>
                  {WAREHOUSES.map((w) => (
                    <option key={w} value={w} disabled={w === fromWarehouse}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Section */}
            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-white font-semibold mb-4">Transfer Items</h3>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Product
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) - Available: {p.quantityOnHand}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={addItem}
                      className="w-32 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {items.length > 0 && (
                <div className="bg-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900">
                      <tr>
                        <th className="text-left px-4 py-2 text-slate-300">SKU</th>
                        <th className="text-right px-4 py-2 text-slate-300">Quantity</th>
                        <th className="text-center px-4 py-2 text-slate-300">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-t border-slate-600">
                          <td className="px-4 py-2 text-slate-300">{item.productSku}</td>
                          <td className="px-4 py-2 text-right text-white">{item.quantity}</td>
                          <td className="px-4 py-2 text-center">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:bg-slate-600"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={items.length === 0 || !fromWarehouse || !toWarehouse}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                Create Transfer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
