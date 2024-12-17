import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';
import axios from 'axios';

const BubbleChart = ({ selectedOptionBub, fromDate, toDate }) => {
  const [chartData, setChartData] = useState(null);
  
  // Function to fetch the data from backend
  const fetchChartData = async () => {
    try {
      // Construct the API endpoint dynamically using selectedOptionBub
      const endpoint = `https://aquadb-server.onrender.com/${selectedOptionBub}`;

      // Make the API request with fromDate, toDate
      const response = await axios.post(endpoint, {
        from: fromDate,
        to: toDate
      });

      const data = response.data;

      // Format the data for the Bubble chart
      const formattedData = data.datasets[0].data.map((item) => ({
        x: new Date(item.x).getTime(),  // Convert date string to a timestamp
        y: item.y,  // y-axis value
        r: item.r,  // Radius (can represent count or another metric)
      }));

      // Set the formatted data to the chartData state
      setChartData({
        datasets: [
          {
            label: data.datasets[0].label, // Change this if needed
            data: formattedData,
            backgroundColor: data.datasets[0].backgroundColor,  // Customize colors
            borderColor: data.datasets[0].borderColor,
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    // Call the fetchChartData function whenever the component mounts or the parameters change
    fetchChartData();
  }, [selectedOptionBub, fromDate, toDate]);

  // If data is still loading, you can show a loading spinner or message
  if (!chartData) {
    return <div>Loading...</div>;
  }

  // Return the Bubble chart with the fetched data
  return <Bubble data={chartData} />;
};

export default BubbleChart;
