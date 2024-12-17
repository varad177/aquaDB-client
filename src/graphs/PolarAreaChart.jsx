import React from 'react';
import { PolarArea } from 'react-chartjs-2';

const PolarAreaChart = () => {
  const data = {
    labels: ['Red', 'Green', 'Yellow', 'Blue', 'Purple'],
    datasets: [
      {
        data: [11, 16, 7, 3, 14],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return <PolarArea data={data} />;
};

export default PolarAreaChart;
