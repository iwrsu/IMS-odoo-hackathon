INSERT INTO products (id, sku, name, description, category, unit_price, quantity_on_hand, reorder_level, status)
VALUES
  ('prod-seed-1', 'SKU-001', 'Laptop Computer', 'High-performance laptop', 'Electronics', 1299.99, 15, 5, 'in-stock'),
  ('prod-seed-2', 'SKU-002', 'Wireless Mouse', 'Ergonomic wireless mouse', 'Accessories', 29.99, 3, 10, 'low-stock'),
  ('prod-seed-3', 'SKU-003', 'USB-C Cable', '2-meter USB-C cable', 'Accessories', 9.99, 0, 20, 'out-of-stock')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, role, warehouse, is_active)
VALUES
  ('user-admin-1', 'admin@coreinventory.com', 'Admin User', 'admin', 'Main Warehouse', TRUE),
  ('user-manager-1', 'manager@coreinventory.com', 'Manager User', 'manager', 'Main Warehouse', TRUE),
  ('user-staff-1', 'staff@coreinventory.com', 'Staff User', 'staff', 'Main Warehouse', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO receipts (id, receipt_number, supplier, status, total_items, total_amount, items, notes)
VALUES (
  'rec-seed-1',
  'REC-SEED-001',
  'Default Supplier',
  'draft',
  2,
  109.98,
  '[
    {"id":"item-seed-r1","productId":"prod-seed-2","productSku":"SKU-002","quantity":2,"unitPrice":29.99,"total":59.98},
    {"id":"item-seed-r2","productId":"prod-seed-3","productSku":"SKU-003","quantity":5,"unitPrice":9.99,"total":49.95}
  ]'::jsonb,
  'Seed receipt'
)
ON CONFLICT (id) DO NOTHING;
