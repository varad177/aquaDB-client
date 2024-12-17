import React from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

const MixedChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        type: 'line',
        label: 'Line Dataset',
        data: [65, 59, 80, 81, 56],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        type: 'bar',
        label: 'Bar Dataset',
        data: [28, 48, 40, 19, 86],
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
      },
    ],
  };

  return <Chart type="bar" data={data} />;
};

export default MixedChart;
