'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  Product,
  Receipt,
  Delivery,
  Transfer,
  Adjustment,
  LedgerEntry,
  DashboardStats,
} from '@/lib/types';

interface InventoryContextType {
  products: Product[];
  receipts: Receipt[];
  deliveries: Delivery[];
  transfers: Transfer[];
  adjustments: Adjustment[];
  ledger: LedgerEntry[];
  stats: DashboardStats;
  loading: boolean;
  
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  addReceipt: (receipt: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateReceipt: (id: string, receipt: Partial<Receipt>) => Promise<void>;
  confirmReceipt: (id: string) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;
  
  addDelivery: (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateDelivery: (id: string, delivery: Partial<Delivery>) => Promise<void>;
  confirmDelivery: (id: string) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
  
  addTransfer: (transfer: Omit<Transfer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTransfer: (id: string, transfer: Partial<Transfer>) => Promise<void>;
  confirmTransfer: (id: string) => Promise<void>;
  deleteTransfer: (id: string) => Promise<void>;
  
  addAdjustment: (adjustment: Omit<Adjustment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateAdjustment: (id: string, adjustment: Partial<Adjustment>) => Promise<void>;
  deleteAdjustment: (id: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const initialStats: DashboardStats = {
  totalProducts: 0,
  lowStockProducts: 0,
  totalInventoryValue: 0,
  recentTransactions: 0,
  documentsInProgress: 0,
};

interface InventorySnapshot {
  products: Product[];
  receipts: Receipt[];
  deliveries: Delivery[];
  transfers: Transfer[];
  adjustments: Adjustment[];
  ledger: LedgerEntry[];
  stats: DashboardStats;
}

async function apiRequest<T>(payload: unknown): Promise<T> {
  const response = await fetch('/api/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || 'Request failed');
  }

  return result as T;
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);

  const applySnapshot = useCallback((snapshot: InventorySnapshot) => {
    setProducts(snapshot.products || []);
    setReceipts(snapshot.receipts || []);
    setDeliveries(snapshot.deliveries || []);
    setTransfers(snapshot.transfers || []);
    setAdjustments(snapshot.adjustments || []);
    setLedger(snapshot.ledger || []);
    setStats(snapshot.stats || initialStats);
  }, []);

  const refresh = useCallback(async () => {
    const response = await fetch('/api/inventory', { cache: 'no-store' });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'Failed to fetch inventory');
    }

    applySnapshot(result.data as InventorySnapshot);
  }, [applySnapshot]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error('Failed to load inventory snapshot:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [refresh]);

  const addProduct = useCallback(
    async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      await apiRequest({ action: 'product.create', payload: product });
      await refresh();
    },
    [refresh]
  );

  const updateProduct = useCallback(
    async (id: string, updatedFields: Partial<Product>) => {
      await apiRequest({ action: 'product.update', id, payload: updatedFields });
      await refresh();
    },
    [refresh]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await apiRequest({ action: 'product.delete', id });
      await refresh();
    },
    [refresh]
  );

  const addReceipt = useCallback(
    async (receipt: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = await apiRequest<{ id: string }>({ action: 'receipt.create', payload: receipt });
      await refresh();
      return result.id;
    },
    [refresh]
  );

  const updateReceipt = useCallback(
    async (id: string, updatedFields: Partial<Receipt>) => {
      await apiRequest({ action: 'receipt.update', id, payload: updatedFields });
      await refresh();
    },
    [refresh]
  );

  const confirmReceipt = useCallback(
    async (id: string) => {
      await apiRequest({ action: 'receipt.confirm', id });
      await refresh();
    },
    [refresh]
  );

  const deleteReceipt = useCallback(
    async (id: string) => {
      await apiRequest({ action: 'receipt.delete', id });
      await refresh();
    },
    [refresh]
  );

  const addDelivery = useCallback(
    async (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = await apiRequest<{ id: string }>({ action: 'delivery.create', payload: delivery });
      await refresh();
      return result.id;
    },
    [refresh]
  );

  const updateDelivery = useCallback(
    async (id: string, updatedFields: Partial<Delivery>) => {
      await apiRequest({ action: 'delivery.update', id, payload: updatedFields });
      await refresh();
    },
    [refresh]
  );

  const confirmDelivery = useCallback(
    async (id: string) => {
      await apiRequest({ action: 'delivery.confirm', id });
      await refresh();
    },
    [refresh]
  );

  const deleteDelivery = useCallback(
    async (id: string) => {
      await apiRequest({ action: 'delivery.delete', id });
      await refresh();
    },
    [refresh]
  );

  const addTransfer = useCallback(
    async (transfer: Omit<Transfer, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = await apiRequest<{ id: string }>({ action: 'transfer.create', payload: transfer });
      await refresh();
      return result.id;
    },
    [refresh]
  );

  const updateTransfer = useCallback(
    async (id: string, updatedFields: Partial<Transfer>) => {
      await apiRequest({ action: 'transfer.update', id, payload: updatedFields });
      await refresh();
    },
    [refresh]
  );

  const confirmTransfer = useCallback(
    async (id: string) => {
      await apiRequest({ action: 'transfer.confirm', id });
      await refresh();
    },
    [refresh]
  );

  const deleteTransfer = useCallback(
    async (id: string) => {
      await apiRequest({ action: 'transfer.delete', id });
      await refresh();
    },
    [refresh]
  );

  const addAdjustment = useCallback(
    async (adjustment: Omit<Adjustment, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = await apiRequest<{ id: string }>({ action: 'adjustment.create', payload: adjustment });
      await refresh();
      return result.id;
    },
    [refresh]
  );

  const updateAdjustment = useCallback(
    async (id: string, updatedFields: Partial<Adjustment>) => {
      await apiRequest({ action: 'adjustment.update', id, payload: updatedFields });
      await refresh();
    },
    [refresh]
  );

  const deleteAdjustment = useCallback(
    async (id: string) => {
      await apiRequest({ action: 'adjustment.delete', id });
      await refresh();
    },
    [refresh]
  );

  return (
    <InventoryContext.Provider
      value={{
        products,
        receipts,
        deliveries,
        transfers,
        adjustments,
        ledger,
        stats,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addReceipt,
        updateReceipt,
        confirmReceipt,
        deleteReceipt,
        addDelivery,
        updateDelivery,
        confirmDelivery,
        deleteDelivery,
        addTransfer,
        updateTransfer,
        confirmTransfer,
        deleteTransfer,
        addAdjustment,
        updateAdjustment,
        deleteAdjustment,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (undefined === context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
}
