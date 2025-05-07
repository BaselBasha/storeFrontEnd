"use client";

import Layout from "@/app/components/Layout";
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spin,
  Modal,
  Image,
  Empty,
  Row,
  Col,
  message,
  Typography,
  Space,
  Statistic,
  Divider,
  InputNumber,
} from "antd";
import {
  ExclamationCircleOutlined,
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axiosWithAuth from "@/app/lib/axiosWithAuth";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CardContext";

const { confirm } = Modal;
const { Title, Text } = Typography;

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: { name: string };
}

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { decrementCartCount } = useCart();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axiosWithAuth.get("https://store-backend-tb6b.onrender.com/cart");
        const items: CartItem[] = Array.isArray(res.data.items)
          ? res.data.items.filter((item: any) => item.product && typeof item.product === "object")
          : [];

        setCartItems(items);
      } catch (err) {
        console.error("Error fetching cart:", err);
        message.error("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await axiosWithAuth.post("https://store-backend-tb6b.onrender.com/cart/update-quantity", {
        productId,
        quantity,
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: Math.min(quantity, item.product.stock || 10),
              }
            : item
        )
      );
      message.success("Quantity updated successfully");
    } catch (err) {
      console.error("Error updating quantity:", err);
      message.error("Failed to update quantity.");
    }
  };

  const handleIncrement = (
    productId: string,
    currentQty: number,
    max: number
  ) => {
    if (currentQty < max) {
      updateQuantity(productId, currentQty + 1);
    }
  };

  const handleDecrement = (productId: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  const removeFromCart = async (productId: string) => {
    confirm({
      title: "Remove item from cart?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Remove",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axiosWithAuth.delete(`/cart/remove/${productId}`);
          message.success("Item removed from cart!");
          setCartItems((prev) =>
            prev.filter((item) => item.product.id !== productId)
          );
          decrementCartCount();
        } catch (err) {
          console.error("Error removing item:", err);
          message.error("Failed to remove item.");
        }
      },
    });
  };

  const handleBuySingle = (productId: string, quantity: string) => {
    router.push(`/checkout?product=${productId}&quantity=${quantity}`);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const totalPrice = cartItems
    .reduce(
      (sum, { product, quantity }) =>
        sum + (product.price || 0) * (quantity || 1),
      0
    )
    .toFixed(2);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <Title level={2} className="mb-6">
          Your Cart
        </Title>
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <Spin size="large" />
          </div>
        ) : cartItems.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text>Your cart is empty.</Text>
                <br />
                <Button
                  type="primary"
                  className="mt-4"
                  onClick={() => router.push("/products")}
                >
                  Shop Now
                </Button>
              </div>
            }
          />
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Row gutter={[24, 24]}>
                {cartItems.map((item, index) => {
                  const product = item.product;
                  if (!product || typeof product !== "object") {
                    console.warn("Invalid product data:", item);
                    return null;
                  }

                  return (
                    <Col xs={24} sm={12} key={product.id || index}>
                      <Card
                        hoverable
                        className="shadow-md"
                        cover={
                          <Image
                            alt={product.name}
                            src={product.imageUrl || "/placeholder-image.jpg"}
                            className="h-48 object-cover w-full"
                            preview
                          />
                        }
                        actions={[
                          <Button
                            key="details"
                            type="link"
                            onClick={() =>
                              router.push(`/product/${product.id}`)
                            }
                          >
                            View Details
                          </Button>,
                          <Button
                            key="remove"
                            type="text"
                            danger
                            onClick={() => removeFromCart(product.id)}
                          >
                            Remove
                          </Button>,
                          <Button
                            key="buy"
                            type="primary"
                            onClick={() => handleBuySingle(product.id, item.quantity.toString())}
                          >
                            Buy Now
                          </Button>,
                        ]}
                      >
                        <Card.Meta
                          title={<Text strong>{product.name}</Text>}
                          description={
                            <Space direction="vertical">
                              <Text type="danger" strong>
                                ${product.price?.toFixed(2)}
                              </Text>
                              <Text type="secondary">
                                Category: {product.category.name}
                              </Text>
                              <Text type="secondary">
                                In Stock: {product.stock}
                              </Text>
                              <div className="flex items-center gap-2">
                                <Text>Quantity:</Text>
                                <Button
                                  icon={<MinusOutlined />}
                                  size="small"
                                  onClick={() =>
                                    handleDecrement(product.id, item.quantity)
                                  }
                                />
                                <InputNumber
                                  min={1}
                                  max={product.stock || 10}
                                  value={item.quantity}
                                  onChange={(value) =>
                                    updateQuantity(
                                      product.id,
                                      typeof value === "number" ? value : 1
                                    )
                                  }
                                  size="small"
                                />
                                <Button
                                  icon={<PlusOutlined />}
                                  size="small"
                                  onClick={() =>
                                    handleIncrement(
                                      product.id,
                                      item.quantity,
                                      product.stock || 10
                                    )
                                  }
                                />
                              </div>
                            </Space>
                          }
                        />
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                title={<Title level={4}>Cart Summary</Title>}
                className="shadow-md sticky top-6"
              >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <Statistic
                    title="Total Items"
                    value={cartItems.reduce(
                      (sum, item) => sum + (item.quantity || 1),
                      0
                    )}
                    prefix={<ShoppingCartOutlined />}
                  />
                  <Statistic
                    title="Total Price"
                    value={totalPrice}
                    prefix="$"
                    precision={2}
                  />
                  <Divider />
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Proceed to Checkout
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
