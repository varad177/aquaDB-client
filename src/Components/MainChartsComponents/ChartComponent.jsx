import React from "react";
import { Bar, Line, Pie, Radar, PolarArea, Scatter, Bubble } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

// Register chart.js components
ChartJS.register(...registerables);

const ChartComponent = ({ chartType }) => {
  // Example data and options
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: `${chartType} Chart`,
        data: [10, 20, 30, 40, 50],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Render the chart dynamically based on type
  const chartMap = {
    Bar: <Bar data={data} options={options} />,
    Line: <Line data={data} options={options} />,
    Pie: <Pie data={data} options={options} />,
    Radar: <Radar data={data} options={options} />,
    PolarArea: <PolarArea data={data} options={options} />,
    Scatter: <Scatter data={data} options={options} />,
    Bubble: <Bubble data={data} options={options} />,
  };

  return <div className="h-64">{chartMap[chartType]}</div>;
};

export default ChartComponent;
