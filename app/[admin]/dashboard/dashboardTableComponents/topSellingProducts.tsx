import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  sellings: number;
  stock: number;
}

export const TopSellingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get<Product[]>('https://store-backend-tb6b.onrender.com/products/top-selling');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching top selling products:', err);
        setError('Failed to load top selling products');
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  // Function to truncate product name to 26 characters
  const truncateName = (name: string) => {
    if (name.length <= 26) return name;
    return name.slice(0, 26) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No top selling products available.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left py-2 pl-4">Image</th>
              <th className="text-left py-2 pl-4">Name</th>
              <th className="text-left py-2 pl-4">Price</th>
              <th className="text-left py-2 pl-4">Sold</th>
              <th className="text-left py-2 pl-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="align-top">
                <td className="py-4 px-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                </td>
                <td className="py-4 pl-4 hover:text-blue-600 hover:underline transition duration-200"><Link href={`products/product/${product.id}`}>{truncateName(product.name)}</Link></td>
                <td className="py-4 pl-4">${product.price.toFixed(2)}</td>
                <td className="py-4 pl-4">{product.sellings}</td>
                <td className="py-4 pl-4">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TopSellingProducts;