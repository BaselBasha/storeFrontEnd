// src/components/ProfitGraph.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProfitData {
  labels: string[];
  data: number[];
}

const ProfitGraph: React.FC = () => {
  const [profitData, setProfitData] = useState<ProfitData>({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [0, 0, 0, 0, 0, 0, 0],
  });
  const [isLoading, setIsLoading] = useState(true);
  const profitDataRef = useRef<ProfitData>(profitData); // For comparison without triggering re-renders

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const response = await fetch('https://store-backend-tb6b.onrender.com/orders/weekly-profit');
        const data: ProfitData = await response.json();

        // Only update state if the data actually changed
        if (
          JSON.stringify(data.labels) !== JSON.stringify(profitDataRef.current.labels) ||
          JSON.stringify(data.data) !== JSON.stringify(profitDataRef.current.data)
        ) {
          setProfitData(data);
          profitDataRef.current = data;
        }
      } catch (error) {
        console.error('Error fetching profit data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfitData();
    const interval = setInterval(fetchProfitData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Chart data
  const chartData = {
    labels: profitData.labels,
    datasets: [
      {
        label: 'Weekly Profit',
        data: profitData.data,
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Profit ($)',
        },
        ticks: {
          callback: (value) => `$${Number(value).toFixed(2)}`,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Days of Week',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 col-span-1 lg:col-span-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Overview</h3>
      <div className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default ProfitGraph;
