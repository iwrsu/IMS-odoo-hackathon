'use client';

import { useState } from 'react';
import { useInventory } from '@/lib/contexts/inventory-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function LedgerPage() {
  const { ledger } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = ledger.filter(
    (entry) =>
      entry.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Inventory Ledger</h1>
        <p className="text-slate-400 mt-1">Complete transaction history</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <Input
          placeholder="Search by SKU or document number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
        />
      </div>

      {/* Ledger Table */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredEntries.length} transactions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700 bg-slate-900">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">
                      Document
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">SKU</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-300">
                      Quantity
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-300">Change</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-300">
                      Unit Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${
                          entry.documentType === 'receipt'
                            ? 'bg-green-900/50 text-green-300'
                            : entry.documentType === 'delivery'
                            ? 'bg-blue-900/50 text-blue-300'
                            : 'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {entry.documentType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white font-mono text-xs">
                        {entry.documentNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{entry.productSku}</td>
                      <td className="px-4 py-3 text-right text-white">{entry.quantity}</td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        entry.quantityChange > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {entry.quantityChange > 0 ? '+' : ''}{entry.quantityChange}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-300">
                        ${entry.unitPrice?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
