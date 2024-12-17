import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';

const ScatterChart = ({ selectedOptions, fromDate, toDate }) => {
  const [chartData, setChartData] = useState(null);

  // Function to fetch the data from the backend
  const fetchChartData = async () => {
    try {
      // Construct the API endpoint dynamically using selectedOptionp
      const endpoint = `https://aquadb-server.onrender.com/${selectedOptions}`;

      // Make the API request with fromDate, toDate
      const response = await axios.post(endpoint, {
        from:fromDate,
        to:toDate,
      });

      // Prepare the chart data using the response data
      const data = {
        datasets: [
          {
            label: 'Date vs Total Weight',
            data: response.data.datasets[0].data, // Using the data received from the API
            backgroundColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      };

      // Update the chartData state
      setChartData(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    // Fetch the chart data when the component mounts or when the selectedOptionp, fromDate, or toDate changes
    fetchChartData();
  }, [selectedOptions, fromDate, toDate]);

  return (
    <div>
      {chartData ? (
        <Scatter data={chartData} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default ScatterChart;
