import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const BarChart = ({toDate, fromDate,selectedOption ,filters }) => {
  const [chartData, setChartData] = useState({});
 

  // Dropdown options (can be updated to match your API endpoint options)


  // Function to fetch data based on the selected option and date range
  const fetchData = async () => {
    try {
      const response = await axios.post(`https://aquadb-server.onrender.com/total-catch-weight-${selectedOption}`, {
        from: fromDate,
        to: toDate,
        filters
      });

      const data = response.data;

      // Format the chart data (assuming response.data contains labels and values arrays)
      const formattedData = {
        labels: data.labels,
        datasets: [
          {
            label: data.datasets[0].label,
            data: data.datasets[0].data,
            backgroundColor: data.datasets[0].backgroundColor,
            borderColor:data.datasets[0].borderColor,
            borderWidth: 1,
          },
        ],
      };

      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Effect to fetch data when the dropdown option or date range changes
  useEffect(() => {
    if (selectedOption !== 'default') {
      fetchData();
    }
  }, [selectedOption, fromDate, toDate]);





  return (
    <div>
    

      {/* Date Pickers */}
     

      {/* Bar chart */}
      <div>
        {chartData.labels ? (
          <Bar data={chartData} />
        ) : (
          <p>Select an option and date range to view the chart data.</p>
        )}
      </div>
    </div>
  );
};

export default BarChart;
