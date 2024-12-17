import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const DoughnutChart = ({ toDate, fromDate, selectedOptiond }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChartData = async () => {
    setLoading(true); // Set loading to true when fetching data
    setError(null); // Clear any previous error

    try {
      const endpoint = `https://aquadb-server.onrender.com/${selectedOptiond}`;

      const response = await axios.post(endpoint, {
        from: fromDate,
        to: toDate,
      });

      const data = response.data;
      console.log(response.data);
      

      setChartData({
        labels: data.labels,
        datasets: [
          {
            data: data.datasets[0].data,
            backgroundColor: data.datasets[0].backgroundColor,
          },
        ],
      });


      console.log(chartData);
      
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to load chart data. Please try again later.');
    } finally {
      setLoading(false); // Stop loading once data fetch completes
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedOptiond, fromDate, toDate]);

  if (loading) {
    return <p>Loading chart data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!chartData) {
    return <p>No data available for the selected parameters.</p>;
  }

  return (
    <div style={{ width: '50%', margin: 'auto' }}>
      <Doughnut data={chartData} />
    </div>
  );
};

export default DoughnutChart;
