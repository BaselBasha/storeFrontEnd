import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

type TimePeriod =  "week" | "month" | "3months" | "year";

// Define the shape of the data returned from the backend
interface ChartData {
  labels: string[];
  data: number[];
}

export const OrdersChart = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week");
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number }[];
  }>({
    labels: [],
    datasets: [
      {
        label: "Orders",
        data: [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
    ],
  });
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend based on the selected time period
  const fetchChartData = async (period: TimePeriod) => {
    try {
      setLoading(true);
      const response = await axios.get<ChartData>(`http://localhost:4000/orders/graph/${period}`);
      const { labels, data } = response.data;

      setChartData({
        labels,
        datasets: [
          {
            label: "Orders",
            data,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.3,
          },
        ],
      });
    } catch (error) {
      console.error(`Error fetching ${period} data:`, error);
      // Fallback to empty data on error
      setChartData({
        labels: [],
        datasets: [
          {
            label: "Orders",
            data: [],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.3,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or timePeriod changes
  useEffect(() => {
    fetchChartData(timePeriod);
  }, [timePeriod]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Orders by {timePeriod}</h3>
        <select
          className="text-sm border rounded p-1"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="3months">3 Months</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div className="h-64">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default OrdersChart;