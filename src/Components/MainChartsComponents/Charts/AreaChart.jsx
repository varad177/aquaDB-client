import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AreaChart = () => {
  // Dummy data
  const dummyData = [
    {
      FISHING_DATE: "2/19/2009",
      SHOOT_LAT: 18.455278,
      SHOOT_LONG: 84.431111,
      DEPTH: "52m",
      MAJOR_SPECIES: "Longfish(200), Ponyfish(90), Nemipters(50), Upenius(50)",
      TOTAL_CATCH: 390,
    },
    {
      FISHING_DATE: "2/14/2009",
      SHOOT_LAT: 18.445,
      SHOOT_LONG: 84.494167,
      DEPTH: "60m",
      MAJOR_SPECIES:
        "Drab crocker(500), Mackeral(200), Dieddaba(200), Carangid(100)",
      TOTAL_CATCH: 1000,
    },
    {
      FISHING_DATE: "2/19/2009",
      SHOOT_LAT: 18.240833,
      SHOOT_LONG: 84.161667,
      DEPTH: "30m",
      MAJOR_SPECIES: "Pomfret(400), Ponyfish(100)",
      TOTAL_CATCH: 500,
    },
    {
      FISHING_DATE: "2/12/2009",
      SHOOT_LAT: 17.993611,
      SHOOT_LONG: 83.774444,
      DEPTH: "35m",
      MAJOR_SPECIES:
        "Drab croaker(200), Nemipters(125), Upenius(125), Mackeral(100)",
      TOTAL_CATCH: 550,
    },
    {
      FISHING_DATE: "3/8/2009",
      SHOOT_LAT: 17.708056,
      SHOOT_LONG: 83.39,
      DEPTH: "20m",
      MAJOR_SPECIES:
        "Drabcrocker(50), Nemipters(20), Lizardfish(10), Ponyfish(10), Squid(5)",
      TOTAL_CATCH: 95,
    },
    {
      FISHING_DATE: "3/10/2009",
      SHOOT_LAT: 17.690833,
      SHOOT_LONG: 83.471944,
      DEPTH: "50m",
      MAJOR_SPECIES: "Lizardfish(20), Nemipters(20), Anchovies(5), Shrimp(1)",
      TOTAL_CATCH: 46,
    },
    {
      FISHING_DATE: "3/10/2009",
      SHOOT_LAT: 17.638333,
      SHOOT_LONG: 83.398333,
      DEPTH: "35m",
      MAJOR_SPECIES: "Lizardfish(10), Ponyfish(5), Squid(2), Nemipters(1)",
      TOTAL_CATCH: 18,
    },
    {
      FISHING_DATE: "3/6/2009",
      SHOOT_LAT: 17.638056,
      SHOOT_LONG: 83.303056,
      DEPTH: "18m",
      MAJOR_SPECIES:
        "PonyFish(30), Lizardfish(20), Ribbonfish(10), Nemipters(10), Squid(20)",
      TOTAL_CATCH: 90,
    },
  ];

  const [xAxis, setXAxis] = useState("FISHING_DATE"); // Default X-Axis
  const [yAxis, setYAxis] = useState("TOTAL_CATCH"); // Default Y-Axis
  const [filteredData, setFilteredData] = useState(dummyData); // Using dummy data

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "xAxis") setXAxis(value);
    if (name === "yAxis") setYAxis(value);
  };

  const chartData = {
    labels: filteredData.map((item) =>
      xAxis === "FISHING_DATE"
        ? dayjs(item.FISHING_DATE).format("DD/MM/YYYY")
        : xAxis === "SHOOT_LAT"
        ? item.SHOOT_LAT
        : item.SHOOT_LONG
    ),
    datasets: [
      {
        label: yAxis === "TOTAL_CATCH" ? "Total Catch (kg)" : "Depth (m)",
        data: filteredData.map((item) => item[yAxis]),
        fill: true,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <h2>Fish Catch Area Chart</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label>Select X-Axis:</label>
          <select name="xAxis" value={xAxis} onChange={handleFilterChange}>
            <option value="FISHING_DATE">Fishing Date</option>
            <option value="SHOOT_LAT">Latitude</option>
            <option value="SHOOT_LONG">Longitude</option>
          </select>
        </div>

        <div>
          <label>Select Y-Axis:</label>
          <select name="yAxis" value={yAxis} onChange={handleFilterChange}>
            <option value="TOTAL_CATCH">Total Catch</option>
            <option value="DEPTH">Depth</option>
          </select>
        </div>
      </div>

      {/* Area Chart */}
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Fish Catch Trends",
            },
          },
          scales: {
            x: {
              type: xAxis === "FISHING_DATE" ? "time" : "linear",
              title: {
                display: true,
                text:
                  xAxis === "FISHING_DATE"
                    ? "Date"
                    : xAxis === "SHOOT_LAT"
                    ? "Latitude"
                    : "Longitude",
              },
              time: {
                unit: "day",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text:
                  yAxis === "TOTAL_CATCH" ? "Total Catch (kg)" : "Depth (m)",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default AreaChart;
