// Mock Users
export const mockUsers = {
  'demo@example.com': {
    password: 'demo123',
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'admin' as const,
      warehouse: 'wh-001'
    }
  },
  'manager@example.com': {
    password: 'manager123',
    user: {
      id: '2',
      name: 'Manager User',
      email: 'manager@example.com',
      role: 'manager' as const,
      warehouse: 'wh-001'
    }
  }
};

// Mock Warehouses
export const mockWarehouses = [
  {
    id: 'wh-001',
    name: 'Main Warehouse',
    location: 'New York, NY',
    manager: 'John Smith',
    capacity: 10000,
    currentUtilization: 6500
  },
  {
    id: 'wh-002',
    name: 'Secondary Warehouse',
    location: 'Los Angeles, CA',
    manager: 'Sarah Johnson',
    capacity: 8000,
    currentUtilization: 4200
  },
  {
    id: 'wh-003',
    name: 'Distribution Center',
    location: 'Chicago, IL',
    manager: 'Mike Wilson',
    capacity: 12000,
    currentUtilization: 7800
  }
];

// Mock Products
export const mockProducts = [
  {
    id: 'prod-001',
    sku: 'SKU-001',
    name: 'Laptop Computer',
    description: 'High-performance laptop for business',
    category: 'Electronics',
    unitPrice: 1200,
    quantityOnHand: 45,
    reorderLevel: 10,
    status: 'in-stock' as const,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10'
  },
  {
    id: 'prod-002',
    sku: 'SKU-002',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    category: 'Accessories',
    unitPrice: 35,
    quantityOnHand: 5,
    reorderLevel: 20,
    status: 'low-stock' as const,
    createdAt: '2024-01-20',
    updatedAt: '2024-03-12'
  },
  {
    id: 'prod-003',
    sku: 'SKU-003',
    name: 'USB-C Cable',
    description: 'High-speed USB-C charging cable',
    category: 'Cables',
    unitPrice: 15,
    quantityOnHand: 0,
    reorderLevel: 50,
    status: 'out-of-stock' as const,
    createdAt: '2024-02-01',
    updatedAt: '2024-03-11'
  },
  {
    id: 'prod-004',
    sku: 'SKU-004',
    name: 'Monitor 27"',
    description: '4K UHD display monitor',
    category: 'Electronics',
    unitPrice: 450,
    quantityOnHand: 12,
    reorderLevel: 5,
    status: 'in-stock' as const,
    createdAt: '2024-02-05',
    updatedAt: '2024-03-13'
  },
  {
    id: 'prod-005',
    sku: 'SKU-005',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical gaming keyboard',
    category: 'Accessories',
    unitPrice: 120,
    quantityOnHand: 28,
    reorderLevel: 15,
    status: 'in-stock' as const,
    createdAt: '2024-02-10',
    updatedAt: '2024-03-10'
  },
  {
    id: 'prod-006',
    sku: 'SKU-006',
    name: 'HDMI Cable',
    description: '2m HDMI 2.1 cable',
    category: 'Cables',
    unitPrice: 20,
    quantityOnHand: 150,
    reorderLevel: 50,
    status: 'in-stock' as const,
    createdAt: '2024-02-15',
    updatedAt: '2024-03-12'
  },
  {
    id: 'prod-007',
    sku: 'SKU-007',
    name: 'External SSD 1TB',
    description: 'Portable SSD storage',
    category: 'Storage',
    unitPrice: 89,
    quantityOnHand: 32,
    reorderLevel: 10,
    status: 'in-stock' as const,
    createdAt: '2024-02-20',
    updatedAt: '2024-03-11'
  },
  {
    id: 'prod-008',
    sku: 'SKU-008',
    name: 'Webcam HD',
    description: '1080p HD webcam with microphone',
    category: 'Accessories',
    unitPrice: 75,
    quantityOnHand: 8,
    reorderLevel: 15,
    status: 'low-stock' as const,
    createdAt: '2024-02-25',
    updatedAt: '2024-03-13'
  },
  {
    id: 'prod-009',
    sku: 'SKU-009',
    name: 'USB Hub 7-Port',
    description: 'Multi-port USB 3.0 hub',
    category: 'Accessories',
    unitPrice: 45,
    quantityOnHand: 18,
    reorderLevel: 10,
    status: 'in-stock' as const,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-13'
  },
  {
    id: 'prod-010',
    sku: 'SKU-010',
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand',
    category: 'Accessories',
    unitPrice: 55,
    quantityOnHand: 3,
    reorderLevel: 10,
    status: 'low-stock' as const,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-12'
  }
];

// Status Colors
export const STATUS_COLORS = {
  'in-stock': 'bg-green-100 text-green-800',
  'low-stock': 'bg-amber-100 text-amber-800',
  'out-of-stock': 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-purple-100 text-purple-800',
  shipped: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

// Document Types
export const DOCUMENT_TYPES = {
  RECEIPT: 'receipt',
  DELIVERY: 'delivery',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment'
};

// Warehouse Locations
export const WAREHOUSE_LOCATIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];

// Unit of Measure
export const UNITS_OF_MEASURE = ['pieces', 'kg', 'liters', 'meters', 'boxes', 'packs'];
