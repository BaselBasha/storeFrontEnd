import { useEffect, useState } from 'react'
import axios from 'axios'
import { message } from 'antd'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: string
  specifications?: Record<string, string>
}

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [suggested, setSuggested] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, relatedRes, suggestedRes] = await Promise.all([
          axios.get(`http://localhost:4000/products/${id}`),
          axios.get(`http://localhost:4000/products/${id}/related`),
          axios.get(`http://localhost:4000/products/random/recommendations`),
        ])

        setProduct(productRes.data)
        setRelated(relatedRes.data)
        setSuggested(suggestedRes.data)
      } catch (error) {
        console.error(error)
        message.error('Failed to fetch product data')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  return { product, related, suggested, loading }
}
