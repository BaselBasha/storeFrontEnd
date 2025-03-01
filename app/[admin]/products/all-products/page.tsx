'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

// Centralized state (simple in-memory cache)
let cachedData = {
  products: [] as Product[],
  categories: [] as Category[],
  fetched: false,
};

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
  salesCount?: number;
}

interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
}

function AllProducts() {
  const [products, setProducts] = useState<Product[]>(cachedData.products);
  const [categories, setCategories] = useState<Category[]>(cachedData.categories);
  const [loading, setLoading] = useState<boolean>(!cachedData.fetched);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(true); // New state for notification

  useEffect(() => {
    setHydrated(true);

    if (cachedData.fetched) {
      setProducts(cachedData.products);
      setCategories(cachedData.categories);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const productsResponse = await fetch('http://localhost:4000/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData: Product[] = await productsResponse.json();

        const categoriesResponse = await fetch('http://localhost:4000/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData: Category[] = await categoriesResponse.json();

        cachedData = {
          products: productsData,
          categories: categoriesData,
          fetched: true,
        };

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentlyAdded = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const mostSelling = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 5);

  const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/admin/products/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer w-48">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={192}
            height={128}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        <div className="p-2">
          <h2 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h2>
          <p className="text-xs text-gray-600 mt-1 truncate">{product.description}</p>
          <p className="text-sm font-bold text-gray-900 mt-1">${product.price.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
        </div>
      </div>
    </Link>
  );

  const CategoryCard = ({ category }: { category: Category }) => (
    <Link href={`/admin/categories/${category.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer w-48">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            width={192}
            height={128}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        <div className="p-2 text-center">
          <h3 className="text-sm font-semibold text-gray-800">{category.name}</h3>
        </div>
      </div>
    </Link>
  );

  if (!hydrated) {
    return (
      <ProtectedAdmin>
        <div className={cn("flex flex-col md:flex-row h-screen w-full mx-auto")}>
          <Sidebar initialOpen={false} />
          <div className="flex-1 p-6 bg-gray-50 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">All Products</h1>
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </ProtectedAdmin>
    );
  }

  return (
    <ProtectedAdmin>
      <div className={cn("relative flex flex-col md:flex-row h-screen w-full mx-auto")}>
        {/* Overlay for darkening the page */}
        {showNotification && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setShowNotification(false)}
          />
        )}

        {/* Notification */}
        {showNotification && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-20 max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Tip</h2>
            <p className="text-gray-700">
              To edit or delete a product, simply click on its card below.
            </p>
            <button
              onClick={() => setShowNotification(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        )}

        {/* Main Content */}
        <div
          className={cn(
            "flex flex-col md:flex-row h-screen w-full mx-auto transition-all duration-300",
            showNotification ? "filter brightness-75" : ""
          )}
        >
          <Sidebar initialOpen={false} />
          <div className="flex-1 p-6 bg-gray-50 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Products Dashboard</h1>

              {loading && <p className="text-gray-500">Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {!loading && !error && (
                <div className="space-y-12">
                  {/* Recently Added Products */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Added Products</h2>
                    {recentlyAdded.length === 0 ? (
                      <p className="text-gray-500">No recent products.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {recentlyAdded.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Most Selling Products */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Most Selling Products</h2>
                    {mostSelling.length === 0 ? (
                      <p className="text-gray-500">No sales data available.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {mostSelling.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
                    {categories.length === 0 ? (
                      <p className="text-gray-500">No categories found.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories.map((category) => (
                          <CategoryCard key={category.id} category={category} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedAdmin>
  );
}

export default AllProducts;