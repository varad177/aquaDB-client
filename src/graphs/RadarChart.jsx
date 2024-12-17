import React from 'react';
import { Radar } from 'react-chartjs-2';

const RadarChart = () => {
  const data = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 90, 81, 56, 55],
        backgroundColor: 'rgba(179, 181, 198, 0.2)',
        borderColor: 'rgba(179, 181, 198, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Radar data={data} />;
};

export default RadarChart;
