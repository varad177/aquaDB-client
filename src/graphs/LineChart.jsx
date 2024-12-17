import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ selectedOptionl, fromDate, toDate }) => {
  const [chartData, setChartData] = useState(null);

  const fetchChartData = async () => {
    try {
      // Construct the API endpoint dynamically using selectedOptionl
      const endpoint = `https://aquadb-server.onrender.com/${selectedOptionl}`;

      // Make the API request with fromDate, toDate
      const response = await axios.post(endpoint, {
        from: fromDate,
        to: toDate,
      });

      const data = response.data;

      // Set the chart data state with the received labels and datasets
      setChartData({
        labels: data.labels, // Labels from the backend response (months)
        datasets: data.datasets.map((dataset) => ({
          label: dataset.label,
          data: dataset.data, // The catch weight data
          borderColor: dataset.borderColor, // Border color for the line
          tension: dataset.tension, // Line tension for smoothing
        })),
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    // Fetch chart data whenever the component mounts or when the parameters change
    fetchChartData();
  }, [selectedOptionl, fromDate, toDate]); // Trigger on dependency change

  // If data is not available yet, show a loading message
  if (!chartData) {
    return <div>Loading chart data...</div>;
  }

  return <Line data={chartData} />;
};

export default LineChart;
