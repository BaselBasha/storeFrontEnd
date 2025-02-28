'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl?: string | null;
  specifications?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    // Mark as hydrated after first render
    setHydrated(true);

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Render minimal content until hydrated
  if (!hydrated) {
    return (
      <ProtectedAdmin>
        <div className={cn("flex flex-col md:flex-row h-screen w-full mx-auto")}>
          <Sidebar initialOpen={false} />
          <div className="flex-1 p-6 bg-gray-50 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">All Products</h1>
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        </div>
      </ProtectedAdmin>
    );
  }

  return (
    <ProtectedAdmin>
      <div className={cn("flex flex-col md:flex-row h-screen w-full mx-auto")}>
        <Sidebar initialOpen={false} />
        
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">All Products</h1>

            {loading && <p className="text-gray-500">Loading products...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && products.length === 0 && (
              <p className="text-gray-500">No products found.</p>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                      <p className="text-sm text-gray-600 mt-1 truncate">{product.description}</p>
                      <p className="text-lg font-bold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 mt-1">Stock: {product.stock}</p>
                      {product.specifications?.colors && (
                        <div className="mt-2 flex gap-2">
                          {Object.entries(product.specifications.colors).map(([color, spec]) => (
                            <div
                              key={color}
                              className="w-5 h-5 rounded-full"
                              style={{ backgroundColor: color }}
                              title={`${color} - Stock: ${(spec as { stock: number }).stock}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedAdmin>
  );
}

export default AllProducts;