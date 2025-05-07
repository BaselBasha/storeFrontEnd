import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
}

const OutOfStock: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch out of stock products from backend
  useEffect(() => {
    const fetchOutOfStockProducts = async () => {
      try {
        const response = await fetch('https://store-backend-tb6b.onrender.com/products/out-of-stock'); // Adjust the URL if necessary
        const data = await response.json();
        setProducts(data); // Assuming the API returns an array of products
      } catch (error) {
        console.error('Error fetching out-of-stock products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOutOfStockProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 col-span-1 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Out of Stock Products</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 col-span-1 lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Out of Stock Products</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500">
            <th className="text-left">Image</th>
            <th className="text-left">Name</th>
            <th className="text-left">Price</th>
            <th className="text-left">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No out-of-stock products.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Image
                    src={product.image || '/default-product.jpg'} // Fallback image if no image
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                </td>
                <td>
                    <Link href={`products/product/${product.id}`} className='hover:text-blue-600 transform duration-200 hover:underline'>
                        {product.name}
                    </Link>
                </td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OutOfStock;
