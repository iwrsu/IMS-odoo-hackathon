'use client';

import { useState } from 'react';
import { useInventory } from '@/lib/contexts/inventory-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Eye, Trash2 } from 'lucide-react';
import AdjustmentModal from '@/components/adjustments/adjustment-modal';
import AdjustmentDetailModal from '@/components/adjustments/adjustment-detail-modal';
import { Adjustment } from '@/lib/types';

export default function AdjustmentsPage() {
  const { adjustments, addAdjustment, deleteAdjustment } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<Adjustment | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'increase':
        return 'bg-green-900/50 text-green-300';
      case 'decrease':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'write-off':
        return 'bg-red-900/50 text-red-300';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory Adjustments</h1>
          <p className="text-slate-400 mt-1">Manage stock corrections and write-offs</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={20} className="mr-2" />
          New Adjustment
        </Button>
      </div>

      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Adjustments</CardTitle>
          <CardDescription className="text-slate-400">
            {adjustments.length} adjustments recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adjustments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No adjustments yet</p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Create First Adjustment
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700 bg-slate-900">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">
                      Adjustment #
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">Reason</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-300">Items</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">Date</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adjustments.map((adjustment) => (
                    <tr
                      key={adjustment.id}
                      className="border-b border-slate-700 hover:bg-slate-700/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-300">
                        {adjustment.adjustmentNumber}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(adjustment.type)}`}>
                          {adjustment.type === 'write-off' ? 'Write-Off' : adjustment.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{adjustment.reason}</td>
                      <td className="px-4 py-3 text-right text-white">
                        {adjustment.totalItems}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(adjustment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedAdjustment(adjustment)}
                            className="text-blue-400 hover:bg-slate-700"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteAdjustment(adjustment.id)}
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

      <AdjustmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addAdjustment} />
      <AdjustmentDetailModal
        adjustment={selectedAdjustment}
        onClose={() => setSelectedAdjustment(null)}
      />
    </div>
  );
}
