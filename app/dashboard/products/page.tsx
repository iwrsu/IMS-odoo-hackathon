'use client';

import { useState } from 'react';
import { useInventory } from '@/lib/contexts/inventory-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import ProductModal from '@/components/products/product-modal';
import { Product } from '@/lib/types';
import { useAuth } from "@/lib/contexts/auth-context"


export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addProduct(product);
    setIsModalOpen(false);
  };

  const handleUpdateProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, product);
      setSelectedProduct(null);
      setIsModalOpen(false);
    }
  };
  const {user} = useAuth()
  const role = user?.role

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-slate-400 mt-1">Manage your inventory items</p>
        </div>
        {role != "staff" &&(
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
        )}
       
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <Input
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
        />
      </div>

      {/* Products Table */}
      <Card className="border-slate-700 bg-slate-800 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white">Product Inventory</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredProducts.length} products found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No products found</p>
              <Button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsModalOpen(true);
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Create First Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700 bg-slate-900">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">SKU</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">Category</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-300">Qty</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-300">Price</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-300">Status</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-300 font-mono text-xs">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">{product.name}</div>
                        <div className="text-xs text-slate-400">{product.description}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{product.category}</td>
                      <td className="px-4 py-3 text-right text-white font-medium">
                        {product.quantityOnHand}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-300">
                        ${product.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            product.status === 'in-stock'
                              ? 'bg-green-900/50 text-green-300'
                              : product.status === 'low-stock'
                              ? 'bg-yellow-900/50 text-yellow-300'
                              : 'bg-red-900/50 text-red-300'
                          }`}
                        >
                          {product.status === 'in-stock'
                            ? 'In Stock'
                            : product.status === 'low-stock'
                            ? 'Low Stock'
                            : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-400 hover:bg-slate-700"
                          >
                            <Edit2 size={16} />
                          </Button>
                          {role != "staff" &&(
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              void deleteProduct(product.id);
                            }}
                            className="text-red-400 hover:bg-slate-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                          )}
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}
        product={selectedProduct}
      />
    </div>
  );
}
