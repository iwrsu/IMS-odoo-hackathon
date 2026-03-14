import { PoolClient } from 'pg';
import { query, withTransaction } from '@/lib/db';
import {
  Adjustment,
  AdjustmentItem,
  DashboardStats,
  Delivery,
  DeliveryItem,
  DocumentStatus,
  LedgerEntry,
  Product,
  Receipt,
  ReceiptItem,
  StockStatus,
  Transfer,
  TransferItem,
} from '@/lib/types';

interface ProductRow {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unit_price: string | number;
  quantity_on_hand: number;
  reorder_level: number;
  status: StockStatus;
  created_at: string;
  updated_at: string;
}

interface ReceiptRow {
  id: string;
  receipt_number: string;
  supplier: string;
  status: DocumentStatus;
  total_items: number;
  total_amount: string | number;
  items: ReceiptItem[];
  notes: string;
  created_at: string;
  updated_at: string;
}

interface DeliveryRow {
  id: string;
  delivery_number: string;
  customer: string;
  status: DocumentStatus;
  total_items: number;
  total_amount: string | number;
  items: DeliveryItem[];
  notes: string;
  created_at: string;
  updated_at: string;
}

interface TransferRow {
  id: string;
  transfer_number: string;
  from_warehouse: string;
  to_warehouse: string;
  status: DocumentStatus;
  total_items: number;
  items: TransferItem[];
  notes: string;
  created_at: string;
  updated_at: string;
}

interface AdjustmentRow {
  id: string;
  adjustment_number: string;
  type: 'increase' | 'decrease' | 'write-off';
  reason: string;
  total_items: number;
  items: AdjustmentItem[];
  notes: string;
  created_at: string;
  updated_at: string;
}

interface LedgerRow {
  id: string;
  timestamp: string;
  document_type: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
  document_id: string;
  document_number: string;
  product_id: string;
  product_sku: string;
  product_name: string;
  quantity: number;
  quantity_change: number;
  balance_before: number;
  balance_after: number;
  unit_price: string | number;
  user: string;
  notes: string;
}

type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
type ReceiptInput = Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>;
type DeliveryInput = Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>;
type TransferInput = Omit<Transfer, 'id' | 'createdAt' | 'updatedAt'>;
type AdjustmentInput = Omit<Adjustment, 'id' | 'createdAt' | 'updatedAt'>;

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function toDateString(value: string) {
  return new Date(value).toISOString();
}

function getStockStatus(quantity: number, reorderLevel: number): StockStatus {
  if (quantity === 0) return 'out-of-stock';
  if (quantity <= reorderLevel) return 'low-stock';
  return 'in-stock';
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    description: row.description,
    category: row.category,
    unitPrice: Number(row.unit_price),
    quantityOnHand: row.quantity_on_hand,
    reorderLevel: row.reorder_level,
    status: row.status,
    createdAt: toDateString(row.created_at),
    updatedAt: toDateString(row.updated_at),
  };
}

function mapReceipt(row: ReceiptRow): Receipt {
  return {
    id: row.id,
    receiptNumber: row.receipt_number,
    supplier: row.supplier,
    status: row.status,
    totalItems: row.total_items,
    totalAmount: Number(row.total_amount),
    items: row.items ?? [],
    notes: row.notes,
    createdAt: toDateString(row.created_at),
    updatedAt: toDateString(row.updated_at),
  };
}

function mapDelivery(row: DeliveryRow): Delivery {
  return {
    id: row.id,
    deliveryNumber: row.delivery_number,
    customer: row.customer,
    status: row.status,
    totalItems: row.total_items,
    totalAmount: Number(row.total_amount),
    items: row.items ?? [],
    notes: row.notes,
    createdAt: toDateString(row.created_at),
    updatedAt: toDateString(row.updated_at),
  };
}

function mapTransfer(row: TransferRow): Transfer {
  return {
    id: row.id,
    transferNumber: row.transfer_number,
    fromWarehouse: row.from_warehouse,
    toWarehouse: row.to_warehouse,
    status: row.status,
    totalItems: row.total_items,
    items: row.items ?? [],
    notes: row.notes,
    createdAt: toDateString(row.created_at),
    updatedAt: toDateString(row.updated_at),
  };
}

function mapAdjustment(row: AdjustmentRow): Adjustment {
  return {
    id: row.id,
    adjustmentNumber: row.adjustment_number,
    type: row.type,
    reason: row.reason,
    totalItems: row.total_items,
    items: row.items ?? [],
    notes: row.notes,
    createdAt: toDateString(row.created_at),
    updatedAt: toDateString(row.updated_at),
  };
}

function mapLedger(row: LedgerRow): LedgerEntry {
  return {
    id: row.id,
    timestamp: toDateString(row.timestamp),
    documentType: row.document_type,
    documentId: row.document_id,
    documentNumber: row.document_number,
    productId: row.product_id,
    productSku: row.product_sku,
    productName: row.product_name,
    quantity: row.quantity,
    quantityChange: row.quantity_change,
    balanceBefore: row.balance_before,
    balanceAfter: row.balance_after,
    unitPrice: Number(row.unit_price),
    user: row.user,
    notes: row.notes,
  };
}

async function insertLedgerEntry(
  client: PoolClient,
  entry: Omit<LedgerEntry, 'id' | 'timestamp'>
) {
  await client.query(
    `
      INSERT INTO ledger_entries (
        id,
        timestamp,
        document_type,
        document_id,
        document_number,
        product_id,
        product_sku,
        product_name,
        quantity,
        quantity_change,
        balance_before,
        balance_after,
        unit_price,
        "user",
        notes
      ) VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `,
    [
      makeId('ledger'),
      entry.documentType,
      entry.documentId,
      entry.documentNumber,
      entry.productId,
      entry.productSku,
      entry.productName,
      entry.quantity,
      entry.quantityChange,
      entry.balanceBefore,
      entry.balanceAfter,
      entry.unitPrice,
      entry.user,
      entry.notes,
    ]
  );
}

export async function listProducts() {
  const result = await query<ProductRow>('SELECT * FROM products ORDER BY created_at DESC');
  return result.rows.map(mapProduct);
}

export async function createProduct(input: ProductInput) {
  const id = makeId('prod');
  const status = getStockStatus(input.quantityOnHand, input.reorderLevel);

  const result = await query<ProductRow>(
    `
      INSERT INTO products (
        id, sku, name, description, category, unit_price, quantity_on_hand, reorder_level, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `,
    [
      id,
      input.sku,
      input.name,
      input.description,
      input.category,
      input.unitPrice,
      input.quantityOnHand,
      input.reorderLevel,
      status,
    ]
  );

  return mapProduct(result.rows[0]);
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const current = await query<ProductRow>('SELECT * FROM products WHERE id = $1', [id]);
  if (!current.rows[0]) {
    throw new Error('Product not found');
  }

  const existing = mapProduct(current.rows[0]);
  const quantityOnHand = input.quantityOnHand ?? existing.quantityOnHand;
  const reorderLevel = input.reorderLevel ?? existing.reorderLevel;
  const status = getStockStatus(quantityOnHand, reorderLevel);

  const result = await query<ProductRow>(
    `
      UPDATE products
      SET
        sku = $2,
        name = $3,
        description = $4,
        category = $5,
        unit_price = $6,
        quantity_on_hand = $7,
        reorder_level = $8,
        status = $9,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      input.sku ?? existing.sku,
      input.name ?? existing.name,
      input.description ?? existing.description,
      input.category ?? existing.category,
      input.unitPrice ?? existing.unitPrice,
      quantityOnHand,
      reorderLevel,
      status,
    ]
  );

  return mapProduct(result.rows[0]);
}

export async function deleteProduct(id: string) {
  await query('DELETE FROM products WHERE id = $1', [id]);
}

export async function listReceipts() {
  const result = await query<ReceiptRow>('SELECT * FROM receipts ORDER BY created_at DESC');
  return result.rows.map(mapReceipt);
}

export async function createReceipt(input: ReceiptInput) {
  const id = makeId('receipt');
  const result = await query<ReceiptRow>(
    `
      INSERT INTO receipts (
        id, receipt_number, supplier, status, total_items, total_amount, items, notes, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, NOW(), NOW())
      RETURNING *
    `,
    [
      id,
      input.receiptNumber,
      input.supplier,
      input.status,
      input.totalItems,
      input.totalAmount,
      JSON.stringify(input.items ?? []),
      input.notes,
    ]
  );

  return mapReceipt(result.rows[0]);
}

export async function updateReceipt(id: string, input: Partial<ReceiptInput>) {
  const current = await query<ReceiptRow>('SELECT * FROM receipts WHERE id = $1', [id]);
  if (!current.rows[0]) {
    throw new Error('Receipt not found');
  }

  const existing = mapReceipt(current.rows[0]);

  const result = await query<ReceiptRow>(
    `
      UPDATE receipts
      SET
        receipt_number = $2,
        supplier = $3,
        status = $4,
        total_items = $5,
        total_amount = $6,
        items = $7::jsonb,
        notes = $8,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      input.receiptNumber ?? existing.receiptNumber,
      input.supplier ?? existing.supplier,
      input.status ?? existing.status,
      input.totalItems ?? existing.totalItems,
      input.totalAmount ?? existing.totalAmount,
      JSON.stringify(input.items ?? existing.items),
      input.notes ?? existing.notes,
    ]
  );

  return mapReceipt(result.rows[0]);
}

export async function deleteReceipt(id: string) {
  await query('DELETE FROM receipts WHERE id = $1', [id]);
}

export async function confirmReceipt(id: string) {
  return withTransaction(async (client) => {
    const receiptResult = await client.query<ReceiptRow>('SELECT * FROM receipts WHERE id = $1 FOR UPDATE', [id]);
    const receiptRow = receiptResult.rows[0];
    if (!receiptRow) {
      throw new Error('Receipt not found');
    }

    const receipt = mapReceipt(receiptRow);
    if (receipt.status === 'confirmed') {
      return receipt;
    }

    for (const item of receipt.items) {
      const productResult = await client.query<ProductRow>('SELECT * FROM products WHERE id = $1 FOR UPDATE', [item.productId]);
      const productRow = productResult.rows[0];
      if (!productRow) {
        throw new Error(`Product not found for receipt item (${item.productSku})`);
      }

      const beforeQty = productRow.quantity_on_hand;
      const afterQty = beforeQty + item.quantity;
      const nextStatus = getStockStatus(afterQty, productRow.reorder_level);

      await client.query(
        'UPDATE products SET quantity_on_hand = $2, status = $3, updated_at = NOW() WHERE id = $1',
        [productRow.id, afterQty, nextStatus]
      );

      await insertLedgerEntry(client, {
        documentType: 'receipt',
        documentId: receipt.id,
        documentNumber: receipt.receiptNumber,
        productId: productRow.id,
        productSku: productRow.sku,
        productName: productRow.name,
        quantity: item.quantity,
        quantityChange: item.quantity,
        balanceBefore: beforeQty,
        balanceAfter: afterQty,
        unitPrice: item.unitPrice,
        user: 'system',
        notes: receipt.notes || `Receipt from ${receipt.supplier}`,
      });
    }

    const updated = await client.query<ReceiptRow>(
      'UPDATE receipts SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, 'confirmed']
    );

    return mapReceipt(updated.rows[0]);
  });
}

export async function listDeliveries() {
  const result = await query<DeliveryRow>('SELECT * FROM deliveries ORDER BY created_at DESC');
  return result.rows.map(mapDelivery);
}

export async function createDelivery(input: DeliveryInput) {
  const id = makeId('delivery');
  const result = await query<DeliveryRow>(
    `
      INSERT INTO deliveries (
        id, delivery_number, customer, status, total_items, total_amount, items, notes, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, NOW(), NOW())
      RETURNING *
    `,
    [
      id,
      input.deliveryNumber,
      input.customer,
      input.status,
      input.totalItems,
      input.totalAmount,
      JSON.stringify(input.items ?? []),
      input.notes,
    ]
  );

  return mapDelivery(result.rows[0]);
}

export async function updateDelivery(id: string, input: Partial<DeliveryInput>) {
  const current = await query<DeliveryRow>('SELECT * FROM deliveries WHERE id = $1', [id]);
  if (!current.rows[0]) {
    throw new Error('Delivery not found');
  }

  const existing = mapDelivery(current.rows[0]);

  const result = await query<DeliveryRow>(
    `
      UPDATE deliveries
      SET
        delivery_number = $2,
        customer = $3,
        status = $4,
        total_items = $5,
        total_amount = $6,
        items = $7::jsonb,
        notes = $8,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      input.deliveryNumber ?? existing.deliveryNumber,
      input.customer ?? existing.customer,
      input.status ?? existing.status,
      input.totalItems ?? existing.totalItems,
      input.totalAmount ?? existing.totalAmount,
      JSON.stringify(input.items ?? existing.items),
      input.notes ?? existing.notes,
    ]
  );

  return mapDelivery(result.rows[0]);
}

export async function deleteDelivery(id: string) {
  await query('DELETE FROM deliveries WHERE id = $1', [id]);
}

export async function confirmDelivery(id: string) {
  return withTransaction(async (client) => {
    const deliveryResult = await client.query<DeliveryRow>('SELECT * FROM deliveries WHERE id = $1 FOR UPDATE', [id]);
    const deliveryRow = deliveryResult.rows[0];
    if (!deliveryRow) {
      throw new Error('Delivery not found');
    }

    const delivery = mapDelivery(deliveryRow);
    if (delivery.status === 'confirmed') {
      return delivery;
    }

    for (const item of delivery.items) {
      const productResult = await client.query<ProductRow>('SELECT * FROM products WHERE id = $1 FOR UPDATE', [item.productId]);
      const productRow = productResult.rows[0];
      if (!productRow) {
        throw new Error(`Product not found for delivery item (${item.productSku})`);
      }

      if (productRow.quantity_on_hand < item.quantity) {
        throw new Error(`Insufficient stock for ${productRow.sku}. Available: ${productRow.quantity_on_hand}`);
      }

      const beforeQty = productRow.quantity_on_hand;
      const afterQty = beforeQty - item.quantity;
      const nextStatus = getStockStatus(afterQty, productRow.reorder_level);

      await client.query(
        'UPDATE products SET quantity_on_hand = $2, status = $3, updated_at = NOW() WHERE id = $1',
        [productRow.id, afterQty, nextStatus]
      );

      await insertLedgerEntry(client, {
        documentType: 'delivery',
        documentId: delivery.id,
        documentNumber: delivery.deliveryNumber,
        productId: productRow.id,
        productSku: productRow.sku,
        productName: productRow.name,
        quantity: item.quantity,
        quantityChange: -item.quantity,
        balanceBefore: beforeQty,
        balanceAfter: afterQty,
        unitPrice: item.unitPrice,
        user: 'system',
        notes: delivery.notes || `Delivery to ${delivery.customer}`,
      });
    }

    const updated = await client.query<DeliveryRow>(
      'UPDATE deliveries SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, 'confirmed']
    );

    return mapDelivery(updated.rows[0]);
  });
}

export async function listTransfers() {
  const result = await query<TransferRow>('SELECT * FROM transfers ORDER BY created_at DESC');
  return result.rows.map(mapTransfer);
}

export async function createTransfer(input: TransferInput) {
  const id = makeId('transfer');
  const result = await query<TransferRow>(
    `
      INSERT INTO transfers (
        id, transfer_number, from_warehouse, to_warehouse, status, total_items, items, notes, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, NOW(), NOW())
      RETURNING *
    `,
    [
      id,
      input.transferNumber,
      input.fromWarehouse,
      input.toWarehouse,
      input.status,
      input.totalItems,
      JSON.stringify(input.items ?? []),
      input.notes,
    ]
  );

  return mapTransfer(result.rows[0]);
}

export async function updateTransfer(id: string, input: Partial<TransferInput>) {
  const current = await query<TransferRow>('SELECT * FROM transfers WHERE id = $1', [id]);
  if (!current.rows[0]) {
    throw new Error('Transfer not found');
  }

  const existing = mapTransfer(current.rows[0]);

  const result = await query<TransferRow>(
    `
      UPDATE transfers
      SET
        transfer_number = $2,
        from_warehouse = $3,
        to_warehouse = $4,
        status = $5,
        total_items = $6,
        items = $7::jsonb,
        notes = $8,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      input.transferNumber ?? existing.transferNumber,
      input.fromWarehouse ?? existing.fromWarehouse,
      input.toWarehouse ?? existing.toWarehouse,
      input.status ?? existing.status,
      input.totalItems ?? existing.totalItems,
      JSON.stringify(input.items ?? existing.items),
      input.notes ?? existing.notes,
    ]
  );

  return mapTransfer(result.rows[0]);
}

export async function deleteTransfer(id: string) {
  await query('DELETE FROM transfers WHERE id = $1', [id]);
}

export async function confirmTransfer(id: string) {
  return withTransaction(async (client) => {
    const transferResult = await client.query<TransferRow>('SELECT * FROM transfers WHERE id = $1 FOR UPDATE', [id]);
    const transferRow = transferResult.rows[0];
    if (!transferRow) {
      throw new Error('Transfer not found');
    }

    const transfer = mapTransfer(transferRow);
    if (transfer.status === 'confirmed') {
      return transfer;
    }

    for (const item of transfer.items) {
      const productResult = await client.query<ProductRow>('SELECT * FROM products WHERE id = $1 FOR UPDATE', [item.productId]);
      const productRow = productResult.rows[0];
      if (!productRow) {
        throw new Error(`Product not found for transfer item (${item.productSku})`);
      }

      const balance = productRow.quantity_on_hand;

      await insertLedgerEntry(client, {
        documentType: 'transfer',
        documentId: transfer.id,
        documentNumber: transfer.transferNumber,
        productId: productRow.id,
        productSku: productRow.sku,
        productName: productRow.name,
        quantity: item.quantity,
        quantityChange: 0,
        balanceBefore: balance,
        balanceAfter: balance,
        unitPrice: Number(productRow.unit_price),
        user: 'system',
        notes:
          transfer.notes ||
          `Internal transfer ${transfer.fromWarehouse} -> ${transfer.toWarehouse}`,
      });
    }

    const updated = await client.query<TransferRow>(
      'UPDATE transfers SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id, 'confirmed']
    );

    return mapTransfer(updated.rows[0]);
  });
}

export async function listAdjustments() {
  const result = await query<AdjustmentRow>('SELECT * FROM adjustments ORDER BY created_at DESC');
  return result.rows.map(mapAdjustment);
}

export async function createAdjustment(input: AdjustmentInput) {
  return withTransaction(async (client) => {
    const id = makeId('adjustment');

    const inserted = await client.query<AdjustmentRow>(
      `
        INSERT INTO adjustments (
          id, adjustment_number, type, reason, total_items, items, notes, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, NOW(), NOW())
        RETURNING *
      `,
      [
        id,
        input.adjustmentNumber,
        input.type,
        input.reason,
        input.totalItems,
        JSON.stringify(input.items ?? []),
        input.notes,
      ]
    );

    const adjustment = mapAdjustment(inserted.rows[0]);

    for (const item of adjustment.items) {
      const productResult = await client.query<ProductRow>('SELECT * FROM products WHERE id = $1 FOR UPDATE', [item.productId]);
      const productRow = productResult.rows[0];
      if (!productRow) {
        throw new Error(`Product not found for adjustment item (${item.productSku})`);
      }

      const beforeQty = productRow.quantity_on_hand;
      const delta = adjustment.type === 'increase' ? item.quantity : -item.quantity;
      const afterQty = Math.max(0, beforeQty + delta);
      const nextStatus = getStockStatus(afterQty, productRow.reorder_level);

      await client.query(
        'UPDATE products SET quantity_on_hand = $2, status = $3, updated_at = NOW() WHERE id = $1',
        [productRow.id, afterQty, nextStatus]
      );

      await insertLedgerEntry(client, {
        documentType: 'adjustment',
        documentId: adjustment.id,
        documentNumber: adjustment.adjustmentNumber,
        productId: productRow.id,
        productSku: productRow.sku,
        productName: productRow.name,
        quantity: item.quantity,
        quantityChange: afterQty - beforeQty,
        balanceBefore: beforeQty,
        balanceAfter: afterQty,
        unitPrice: Number(productRow.unit_price),
        user: 'system',
        notes: item.reason || adjustment.reason,
      });
    }

    return adjustment;
  });
}

export async function updateAdjustment(id: string, input: Partial<AdjustmentInput>) {
  const current = await query<AdjustmentRow>('SELECT * FROM adjustments WHERE id = $1', [id]);
  if (!current.rows[0]) {
    throw new Error('Adjustment not found');
  }

  const existing = mapAdjustment(current.rows[0]);

  const result = await query<AdjustmentRow>(
    `
      UPDATE adjustments
      SET
        adjustment_number = $2,
        type = $3,
        reason = $4,
        total_items = $5,
        items = $6::jsonb,
        notes = $7,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      input.adjustmentNumber ?? existing.adjustmentNumber,
      input.type ?? existing.type,
      input.reason ?? existing.reason,
      input.totalItems ?? existing.totalItems,
      JSON.stringify(input.items ?? existing.items),
      input.notes ?? existing.notes,
    ]
  );

  return mapAdjustment(result.rows[0]);
}

export async function deleteAdjustment(id: string) {
  await query('DELETE FROM adjustments WHERE id = $1', [id]);
}

export async function listLedgerEntries() {
  const result = await query<LedgerRow>('SELECT * FROM ledger_entries ORDER BY timestamp DESC');
  return result.rows.map(mapLedger);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [productMetrics, receiptPending, deliveryPending, transferPending, ledgerCount] = await Promise.all([
    query<{
      total_products: string | number;
      low_stock_products: string | number;
      total_inventory_value: string | number;
    }>(
      `
        SELECT
          COUNT(*)::int AS total_products,
          COUNT(*) FILTER (WHERE status IN ('low-stock', 'out-of-stock'))::int AS low_stock_products,
          COALESCE(SUM(quantity_on_hand * unit_price), 0) AS total_inventory_value
        FROM products
      `
    ),
    query<{ count: string | number }>(
      `SELECT COUNT(*)::int AS count FROM receipts WHERE status NOT IN ('confirmed', 'cancelled')`
    ),
    query<{ count: string | number }>(
      `SELECT COUNT(*)::int AS count FROM deliveries WHERE status NOT IN ('confirmed', 'cancelled')`
    ),
    query<{ count: string | number }>(
      `SELECT COUNT(*)::int AS count FROM transfers WHERE status NOT IN ('confirmed', 'cancelled')`
    ),
    query<{ count: string | number }>('SELECT COUNT(*)::int AS count FROM ledger_entries'),
  ]);

  return {
    totalProducts: Number(productMetrics.rows[0]?.total_products ?? 0),
    lowStockProducts: Number(productMetrics.rows[0]?.low_stock_products ?? 0),
    totalInventoryValue: Number(productMetrics.rows[0]?.total_inventory_value ?? 0),
    recentTransactions: Number(ledgerCount.rows[0]?.count ?? 0),
    documentsInProgress:
      Number(receiptPending.rows[0]?.count ?? 0) +
      Number(deliveryPending.rows[0]?.count ?? 0) +
      Number(transferPending.rows[0]?.count ?? 0),
  };
}

export async function getInventorySnapshot() {
  const [products, receipts, deliveries, transfers, adjustments, ledger, stats] = await Promise.all([
    listProducts(),
    listReceipts(),
    listDeliveries(),
    listTransfers(),
    listAdjustments(),
    listLedgerEntries(),
    getDashboardStats(),
  ]);

  return {
    products,
    receipts,
    deliveries,
    transfers,
    adjustments,
    ledger,
    stats,
  };
}
