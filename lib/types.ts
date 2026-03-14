export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  warehouse?: string;
}

export type DocumentStatus = 'draft' | 'pending' | 'confirmed' | 'shipped' | 'cancelled';
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitPrice: number;
  quantityOnHand: number;
  reorderLevel: number;
  status: StockStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  supplier: string;
  status: DocumentStatus;
  totalItems: number;
  totalAmount: number;
  items: ReceiptItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptItem {
  id: string;
  productId: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  customer: string;
  status: DocumentStatus;
  totalItems: number;
  totalAmount: number;
  items: DeliveryItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryItem {
  id: string;
  productId: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Transfer {
  id: string;
  transferNumber: string;
  fromWarehouse: string;
  toWarehouse: string;
  status: DocumentStatus;
  totalItems: number;
  items: TransferItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferItem {
  id: string;
  productId: string;
  productSku: string;
  quantity: number;
}

export interface Adjustment {
  id: string;
  adjustmentNumber: string;
  type: 'increase' | 'decrease' | 'write-off';
  reason: string;
  totalItems: number;
  items: AdjustmentItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdjustmentItem {
  id: string;
  productId: string;
  productSku: string;
  quantity: number;
  reason: string;
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  documentType: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
  documentId: string;
  documentNumber: string;
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  quantityChange: number;
  balanceBefore: number;
  balanceAfter: number;
  unitPrice: number;
  user: string;
  notes: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  recentTransactions: number;
  documentsInProgress: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  manager: string;
  capacity: number;
  currentUtilization: number;
}
