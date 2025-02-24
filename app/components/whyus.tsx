// components/WhyChooseUs.js
import { FaShippingFast, FaLock, FaTags } from 'react-icons/fa';

export default function WhyChooseUs() {
  return (
    <section className="py-44 z-0 bg-transparent relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Box 1: Fast Delivery */}
          <div className="bg-transparent p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300 border border-red-950 border-solid">
            <FaShippingFast className="text-4xl text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              Get your orders delivered quickly and reliably to your doorstep.
            </p>
          </div>

          {/* Box 2: High Security */}
          <div className="bg-transparent p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300 border border-red-950 border-solid">
            <FaLock className="text-4xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              High Security
            </h3>
            <p className="text-gray-600">
              Shop with confidence knowing your data is safe and secure.
            </p>
          </div>

          {/* Box 3: High Discounts */}
          <div className="bg-transparent p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300 border border-red-950 border-solid">
            <FaTags className="text-4xl text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              High Discounts
            </h3>
            <p className="text-gray-600">
              Enjoy exclusive deals and save big on every purchase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}