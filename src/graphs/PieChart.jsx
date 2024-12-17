import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const PieChart = ({ selectedOptionp, fromDate, toDate }) => {

  const [chartData, setChartData] = useState(null);

  // Function to fetch the data from the backend
  const fetchChartData = async () => {
    try {
      // Construct the API endpoint dynamically using selectedOptionBub
      const endpoint = `https://aquadb-server.onrender.com/${selectedOptionp}`;

      // Make the API request with fromDate, toDate
      const response = await axios.post(endpoint, {
        from: fromDate,
        to: toDate
      });

      const data = response.data;

      // Format the data for the Pie chart
      const formattedData = {
        labels: data.labels,  // Get the labels directly from the backend response
        datasets: [
          {
            data: data.data,  // Use the data array from the backend response
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],  // You can customize the colors here
            borderColor: '#fff',  // Border color (white for pie chart)
            borderWidth: 1,
          },
        ],
      };

      // Set the formatted data to the chartData state
      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    // Call the fetchChartData function whenever the component mounts or the parameters change
    fetchChartData();
  }, [selectedOptionp, fromDate, toDate]);

  // If data is still loading, you can show a loading spinner or message
  if (!chartData) {
    return <div>Loading...</div>;
  }

  return <Pie data={chartData} />;
};

export default PieChart;
