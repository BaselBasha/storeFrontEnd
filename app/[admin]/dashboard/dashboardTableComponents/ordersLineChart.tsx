import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData as ChartJSData,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define types
type TimePeriod = 'daily' | 'weekly' | 'monthly';

interface ChartData {
  labels: string[];
  data: number[];
}

export const OrdersLineChart = () => {
  const [chartData, setChartData] = useState<ChartJSData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Orders',
        data: [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        segment: {
          borderColor: (ctx) => {
            const { p0, p1 } = ctx;
            return p1.parsed.y < p0.parsed.y ? 'red' : '#3b82f6';
          },
          borderDash: (ctx) => {
            const { p0, p1 } = ctx;
            return p0.parsed.y === p1.parsed.y ? [6, 6] : undefined;
          },
        },
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const fetchChartData = async (period: TimePeriod) => {
    try {
      setLoading(true);
      const response = await axios.get<ChartData>(`http://localhost:4000/orders/graph/week`);
      const { labels, data } = response.data;

      setChartData({
        labels,
        datasets: [
          {
            label: 'Orders',
            data,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.3,
            segment: {
              borderColor: (ctx) => {
                const { p0, p1 } = ctx;
                return p1.parsed.y < p0.parsed.y ? 'red' : '#3b82f6';
              },
              borderDash: (ctx) => {
                const { p0, p1 } = ctx;
                return p0.parsed.y === p1.parsed.y ? [6, 6] : undefined;
              },
            },
          },
        ],
      });
    } catch (error) {
      console.error(`Error fetching ${period} data:`, error);
      setChartData({
        labels: [],
        datasets: [
          {
            label: 'Orders',
            data: [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.3,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData('monthly');
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Overview</h3>
      <div className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default OrdersLineChart;
