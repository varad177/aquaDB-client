import React from "react";
import ChartComponent from "./ChartComponent";

const ChartContainer = ({ selectedCharts, onRemoveChart }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Selected Charts</h3>
      <div className="grid grid-cols-2 gap-4">
        {selectedCharts.map((chartType, index) => (
          <div
            key={index}
            className="p-4 border bg-white shadow-md rounded relative"
          >
            {/* Render Chart */}
            <ChartComponent chartType={chartType} />

            {/* Remove Chart Button */}
            <button
              className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded"
              onClick={() => onRemoveChart(chartType)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartContainer;
