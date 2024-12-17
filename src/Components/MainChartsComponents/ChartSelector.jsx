// import React from "react";

// const chartTypes = [
//   AreaChart
// BarChart
// BubbleChart
// Doughnut&Pie Charts
// LineChart
// Mixed Chart Types
// Polar Area Chart
// Radar Chart
// Scatter Chart
// ];

// const ChartSelector = ({ onSelectChart, selectedCharts }) => {
//   return (
//     <div className="p-4 border bg-gray-100 rounded mt-4">
//       <h3 className="text-lg font-bold mb-2">Select Chart Types (Max 4)</h3>
//       <div className="grid grid-cols-4 gap-4">
//         {chartTypes.map((type) => (
//           <button
//             key={type}
//             className={`py-2 px-4 rounded ${
//               selectedCharts.includes(type)
//                 ? "bg-gray-300 text-gray-700"
//                 : "bg-blue-500 text-white hover:bg-blue-600"
//             }`}
//             onClick={() => onSelectChart(type)}
//             disabled={selectedCharts.includes(type)}
//           >
//             {type} Chart
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChartSelector;


