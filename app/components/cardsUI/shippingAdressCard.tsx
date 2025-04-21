'use client';

import React from 'react';
import { Card, Radio, Alert, Input, Button, Typography, message } from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Address {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface Props {
  addressOption: 'default' | 'new';
  setAddressOption: (value: 'default' | 'new') => void;
  defaultAddress?: Address;
  newAddress: Address;
  setNewAddress: (address: Address) => void;
  isEditingAddress: boolean;
  setIsEditingAddress: (val: boolean) => void;
  isAddressComplete: (address?: Address) => boolean;
}

const ShippingAddressCard: React.FC<Props> = ({
  addressOption,
  setAddressOption,
  defaultAddress,
  newAddress,
  setNewAddress,
  isEditingAddress,
  setIsEditingAddress,
  isAddressComplete,
}) => {
  return (
    <Card title="Shipping Address" className="shadow-lg mt-6 p-6 rounded-lg border border-gray-200">
      <Radio.Group
        onChange={(e) => setAddressOption(e.target.value)}
        value={addressOption}
        className="flex flex-col gap-4"
      >
        <Radio value="default" className="flex items-center gap-2">
          <HomeOutlined className="text-lg text-blue-500 pr-2" />
          <span>Use My Address</span>
        </Radio>
        {addressOption === 'default' && (
          <div className="ml-6">
            {defaultAddress ? (
              isAddressComplete(defaultAddress) ? (
                <div className="text-sm text-gray-700 space-y-1 font-semibold">
                  <div>{defaultAddress.addressLine1}</div>
                  <div>
                    {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.postalCode},{' '}
                    {defaultAddress.country}
                  </div>
                </div>
              ) : (
                <Alert
                  type="warning"
                  showIcon
                  message="Your profile address is incomplete and cannot be used for shipping."
                  className="mt-2"
                />
              )
            ) : (
              <Alert
                type="warning"
                showIcon
                message="No address found in your profile."
                className="mt-2"
              />
            )}
          </div>
        )}

        <Radio value="new" className="flex items-center gap-2">
          <PlusOutlined className="text-lg text-green-500 pr-2" />
          <span>Use New Shipping Address</span>
        </Radio>
      </Radio.Group>

      {addressOption === 'new' && (
        <div className="mt-6">
          <Title level={5}>Shipping Address</Title>

          {isEditingAddress ? (
            <div className="space-y-4">
              <Input
                placeholder="Address Line 1"
                value={newAddress.addressLine1}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressLine1: e.target.value })
                }
                className="rounded-md border-gray-300"
              />
              <Input
                placeholder="Address Line 2"
                value={newAddress.addressLine2}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressLine2: e.target.value })
                }
                className="rounded-md border-gray-300"
              />
              <Input
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="rounded-md border-gray-300"
              />
              <Input
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                className="rounded-md border-gray-300"
              />
              <Input
                placeholder="Postal Code"
                value={newAddress.postalCode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, postalCode: e.target.value })
                }
                className="rounded-md border-gray-300"
              />
              <Input
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
                className="rounded-md border-gray-300"
              />

              <Button
                type="primary"
                className="mt-2 bg-blue-500"
                onClick={() => {
                  if (!isAddressComplete(newAddress)) {
                    return message.error('Please complete all required address fields.');
                  }
                  setIsEditingAddress(false);
                  message.success('Shipping address saved.');
                }}
              >
                Save Address
              </Button>
            </div>
          ) : (
            <div className="space-y-1 text-sm text-gray-700 mt-2 font-semibold">
              <div>{newAddress.addressLine1}</div>
              {newAddress.addressLine2 && <div>{newAddress.addressLine2}</div>}
              <div>
                {newAddress.city}, {newAddress.state}, {newAddress.postalCode},{' '}
                {newAddress.country}
              </div>
              <Button type="link" className="pl-0" onClick={() => setIsEditingAddress(true)}>
                Edit
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ShippingAddressCard;
