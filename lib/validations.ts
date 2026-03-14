export interface ValidationError {
  field: string;
  message: string;
}

export function validateProduct(data: {
  sku?: string;
  name?: string;
  category?: string;
  unitPrice?: number;
  quantityOnHand?: number;
  reorderLevel?: number;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.sku || data.sku.trim().length === 0) {
    errors.push({ field: 'sku', message: 'SKU is required' });
  } else if (data.sku.length > 50) {
    errors.push({ field: 'sku', message: 'SKU must be less than 50 characters' });
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Product name is required' });
  } else if (data.name.length > 255) {
    errors.push({ field: 'name', message: 'Product name must be less than 255 characters' });
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  if (data.unitPrice === undefined || data.unitPrice < 0) {
    errors.push({ field: 'unitPrice', message: 'Unit price must be a valid positive number' });
  }

  if (data.quantityOnHand === undefined || data.quantityOnHand < 0) {
    errors.push({ field: 'quantityOnHand', message: 'Quantity must be a non-negative number' });
  }

  if (data.reorderLevel === undefined || data.reorderLevel < 0) {
    errors.push({ field: 'reorderLevel', message: 'Reorder level must be a non-negative number' });
  }

  return errors;
}

export function validateReceipt(data: {
  receiptNumber?: string;
  supplier?: string;
  items?: any[];
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.receiptNumber || data.receiptNumber.trim().length === 0) {
    errors.push({ field: 'receiptNumber', message: 'Receipt number is required' });
  }

  if (!data.supplier || data.supplier.trim().length === 0) {
    errors.push({ field: 'supplier', message: 'Supplier is required' });
  }

  if (!data.items || data.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required' });
  }

  return errors;
}

export function validateDelivery(data: {
  deliveryNumber?: string;
  customer?: string;
  items?: any[];
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.deliveryNumber || data.deliveryNumber.trim().length === 0) {
    errors.push({ field: 'deliveryNumber', message: 'Delivery number is required' });
  }

  if (!data.customer || data.customer.trim().length === 0) {
    errors.push({ field: 'customer', message: 'Customer is required' });
  }

  if (!data.items || data.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required' });
  }

  return errors;
}

export function validateTransfer(data: {
  transferNumber?: string;
  fromWarehouse?: string;
  toWarehouse?: string;
  items?: any[];
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.transferNumber || data.transferNumber.trim().length === 0) {
    errors.push({ field: 'transferNumber', message: 'Transfer number is required' });
  }

  if (!data.fromWarehouse || data.fromWarehouse.trim().length === 0) {
    errors.push({ field: 'fromWarehouse', message: 'Source warehouse is required' });
  }

  if (!data.toWarehouse || data.toWarehouse.trim().length === 0) {
    errors.push({ field: 'toWarehouse', message: 'Destination warehouse is required' });
  }

  if (data.fromWarehouse === data.toWarehouse) {
    errors.push({
      field: 'toWarehouse',
      message: 'Source and destination warehouses must be different',
    });
  }

  if (!data.items || data.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required' });
  }

  return errors;
}

export function validateAdjustment(data: {
  adjustmentNumber?: string;
  reason?: string;
  items?: any[];
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.adjustmentNumber || data.adjustmentNumber.trim().length === 0) {
    errors.push({ field: 'adjustmentNumber', message: 'Adjustment number is required' });
  }

  if (!data.reason || data.reason.trim().length === 0) {
    errors.push({ field: 'reason', message: 'Reason is required' });
  }

  if (!data.items || data.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required' });
  }

  return errors;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateSkuUniqueness(sku: string, existingSkus: string[], excludeId?: string): boolean {
  const lowerSku = sku.toLowerCase();
  return !existingSkus.some((s) => s.toLowerCase() === lowerSku);
}
