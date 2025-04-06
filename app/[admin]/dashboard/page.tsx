'use client';

import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import Image from 'next/image';
import OrdersChart from './dashboardTableComponents/ordersChart';
import TopSellingProducts from './dashboardTableComponents/topSellingProducts';
import UserGrowth from './dashboardTableComponents/userGrowth';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define types for chart data structure
interface ChartDataSet {
  labels: string[];
  data: number[];
}

interface ChartPeriodData {
  orders: ChartDataSet;
  users: ChartDataSet;
  profit: ChartDataSet;
}

// Type for time period
type TimePeriod = 'day' | 'week' | 'month' | '3months' | 'year';

// Sample data function with proper typing
const getChartData = (period: TimePeriod): ChartPeriodData => {
  switch (period) {
    case 'day':
      return {
        orders: {
          labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
          data: [5, 10, 8, 15, 12, 9],
        },
        users: {
          labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
          data: [2, 3, 1, 4, 3, 2],
        },
        profit: {
          labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
          data: [500, 1000, 800, 1500, 1200, 900],
        },
      };
    case 'week':
      return {
        orders: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [12, 19, 3, 5, 2, 3, 9],
        },
        users: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [5, 8, 3, 7, 2, 4, 6],
        },
        profit: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [1200, 1900, 300, 500, 200, 300, 900],
        },
      };
    case 'month':
      return {
        orders: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [50, 70, 40, 60],
        },
        users: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [20, 30, 15, 25],
        },
        profit: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [5000, 7000, 4000, 6000],
        },
      };
    case '3months':
      return {
        orders: {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          data: [200, 250, 180],
        },
        users: {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          data: [80, 100, 70],
        },
        profit: {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          data: [20000, 25000, 18000],
        },
      };
    case 'year':
      return {
        orders: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          data: [100, 120, 90, 110, 130, 150, 140, 160, 130, 110, 100, 120],
        },
        users: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          data: [40, 50, 30, 45, 55, 60, 50, 65, 55, 40, 35, 50],
        },
        profit: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          data: [10000, 12000, 9000, 11000, 13000, 15000, 14000, 16000, 13000, 11000, 10000, 12000],
        },
      };
    default:
      return { orders: { labels: [], data: [] }, users: { labels: [], data: [] }, profit: { labels: [], data: [] } };
  }
};

export default function AdminDashboard() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const chartData = getChartData(timePeriod);

  // Chart configurations with proper typing
  const ordersData: ChartData<'line'> = {
    labels: chartData.orders.labels,
    datasets: [{
      label: 'Orders',
      data: chartData.orders.data,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }],
  };

  const profitData: ChartData<'bar'> = {
    labels: chartData.profit.labels,
    datasets: [{
      label: 'Profit ($)',
      data: chartData.profit.data,
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }],
  };

  const usersData: ChartData<'bar'> = {
    labels: chartData.users.labels,
    datasets: [{
      label: 'New Users',
      data: chartData.users.data,
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
    }],
  };

  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
  };

  return (
    <ProtectedAdmin>
      <div className={cn("flex flex-col md:flex-row h-screen w-full mx-auto")}>
        <Sidebar initialOpen={false} />
        
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <OrdersChart />
              <TopSellingProducts />

              {/* 3. Users Growth Chart */}
              <UserGrowth />

              {/* 4. Top Countries Table */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Countries</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left">Flag</th>
                      <th className="text-left">Country</th>
                      <th className="text-left">Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Image
                          src="/us-flag.png"
                          alt="USA"
                          width={20} // w-5 = 20px
                          height={20} // h-5 = 20px
                          className="rounded-full"
                        />
                      </td>
                      <td>USA</td>
                      <td>1,234</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 5. Profit Chart */}
              <div className="bg-white rounded-lg shadow p-4 col-span-1 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Overview</h3>
                <div className="h-64">
                  <Bar data={profitData} options={chartOptions} />
                </div>
              </div>

              {/* 6. Out of Stock Products Table */}
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
                    <tr>
                      <td>
                        <Image
                          src="/product2.jpg"
                          alt="Product B"
                          width={40} // w-10 = 40px
                          height={40} // h-10 = 40px
                          className="rounded"
                        />
                      </td>
                      <td>Product B</td>
                      <td>$19.99</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 7. Orders Chart */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Overview</h3>
                <div className="h-64">
                  <Line data={ordersData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedAdmin>
  );
}