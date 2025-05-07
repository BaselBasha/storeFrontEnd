import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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

interface UserGrowthData {
  labels: string[];
  data: number[];
}

const UserGrowth: React.FC = () => {
  const [chartData, setChartData] = useState<UserGrowthData>({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [0, 0, 0, 0, 0, 0, 0],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchUserGrowth = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://store-backend-tb6b.onrender.com/users/user-growth'); // Adjust URL to your backend endpoint
        const data: UserGrowthData = await response.json();
        
        setChartData(data);
      } catch (error) {
        console.error('Error fetching user growth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserGrowth();
  }, []);

  // Chart configuration
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'New Users',
        data: chartData.data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue color with transparency
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Users',
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
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h3>
      <div className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default UserGrowth;