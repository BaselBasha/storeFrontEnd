'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, InputNumber, Card, Spin, message, Typography, Image, Descriptions, Skeleton } from 'antd'
import { useProduct } from '@/app/hooks/useProducts'
import Layout from '@/app/components/Layout'

const { Title, Paragraph } = Typography

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [quantity, setQuantity] = useState<number>(1)
  const { product, related, suggested, loading } = useProduct(id)

  const handleCheckout = () => {
    message.success(`Proceeding to checkout with ${quantity} item(s)!`)
  }

  const handleCardClick = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
        <Skeleton active paragraph={{ rows: 4 }} />
        <p className="mt-4 text-gray-500 text-lg">Loading product details...</p>
      </div>
    )
  }

  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
  //       <Title level={3} className="text-red-500">
  //         Error loading product details.
  //       </Title>
  //       <Button type="primary" onClick={() => router.back()} className="mt-4">
  //         Go Back
  //       </Button>
  //     </div>
  //   )
  // }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
        <Title level={3} className="text-gray-500">
          Product not found.
        </Title>
        <Button type="primary" onClick={() => router.push('/')} className="mt-4">
          Return to Home
        </Button>
      </div>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-100 min-h-screen">
        {/* Product Info */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Product Image */}
            <div className="relative flex-shrink-0 w-full md:w-1/2">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={400}
                className="rounded-xl object-cover transition-transform duration-300 hover:scale-105"
                preview={{
                  mask: <span className="text-white bg-black bg-opacity-50 p-2 rounded">Preview</span>,
                }}
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 space-y-6">
              <Title level={2} className="!text-3xl !font-bold !text-gray-800 sm:!text-4xl">
                {product.name}
              </Title>
              <Paragraph className="!text-gray-600 !text-base sm:!text-lg">
                {product.description}
              </Paragraph>
              <Title level={3} className="!text-2xl !font-semibold !text-blue-600 sm:!text-3xl">
                ${product.price.toFixed(2)}
              </Title>

              {/* Quantity and Checkout */}
              <div className="flex items-center gap-4">
                <InputNumber
                  min={1}
                  value={quantity}
                  onChange={(val) => setQuantity(val || 1)}
                  className="w-24 !rounded-lg !border-gray-300 !shadow-sm focus:!border-blue-500"
                  size="large"
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCheckout}
                  className="!bg-gradient-to-r !from-blue-600 !to-blue-700 !text-white !rounded-lg !px-6 !py-2 !shadow-md hover:!shadow-lg transition-all"
                  aria-label="Proceed to Checkout"
                >
                  Proceed to Checkout
                </Button>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div className="mt-8">
                  <Title level={4} className="!text-xl !font-semibold !text-gray-800 sm:!text-2xl">
                    Specifications
                  </Title>
                  <Descriptions
                    bordered
                    column={1}
                    size="middle"
                    className="mt-4 !bg-gray-50 !rounded-lg"
                    styles={{
                      label: { fontWeight: 500, background: '#f9fafb' },
                      content: { background: '#ffffff' },
                    }}
                  >
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <Descriptions.Item key={key} label={key}>
                        {value}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-12">
          <Title level={4} className="!text-xl !font-semibold !text-gray-800 sm:!text-2xl mb-6">
            More from this category
          </Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <Card
                key={item.id}
                hoverable
                className="rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
                cover={
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    height={180}
                    className="object-cover rounded-t-lg"
                    preview={false}
                  />
                }
                onClick={() => handleCardClick(item.id)}
                aria-label={`View ${item.name}`}
              >
                <Card.Meta
                  title={<span className="text-gray-800 font-medium">{item.name}</span>}
                  description={<span className="text-blue-600">${item.price.toFixed(2)}</span>}
                />
              </Card>
            ))}
          </div>
        </div>

        {/* Suggested Products */}
        <div>
          <Title level={4} className="!text-xl !font-semibold !text-gray-800 sm:!text-2xl mb-6">
            Products you may like
          </Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {suggested.map((item) => (
              <Card
                key={item.id}
                hoverable
                className="rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
                cover={
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    height={180}
                    className="object-cover rounded-t-lg"
                    preview={false}
                  />
                }
                onClick={() => handleCardClick(item.id)}
                aria-label={`View ${item.name}`}
              >
                <Card.Meta
                  title={<span className="text-gray-800 font-medium">{item.name}</span>}
                  description={<span className="text-blue-600">${item.price.toFixed(2)}</span>}
                />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProductPage