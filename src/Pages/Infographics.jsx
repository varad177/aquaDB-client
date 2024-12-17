import React, { useEffect, useState, useRef } from "react";
import "chartjs-adapter-date-fns";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DataDisplay from "../Components/Scientist/ScientistDataDisplay";
import * as XLSX from "xlsx";
import AnimationWrapper from "./Animation-page";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
// import ChartSelector from "../Components/MainChartsComponents/ChartSelector";
import ChartContainer from "../Components/MainChartsComponents/ChartsContainer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import AreaChart from "../Components/MainChartsComponents/Charts/AreaChart";
// import ChartSelector from "./ChartSelector";
// import BarChart from "./charts/BarChart";
// import BubbleChart from "./charts/BubbleChart";
// import DoughnutPieChart from "./charts/DoughnutPieChart";
// import LineChart from "./charts/LineChart";
// import MixedChart from "./charts/MixedChart";
// import PolarAreaChart from "./charts/PolarAreaChart";
// import RadarChart from "./charts/RadarChart";
// import ScatterChart from "./charts/ScatterChart";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

mapboxgl.accessToken =
  "pk.eyJ1Ijoic25laGFkMjgiLCJhIjoiY2x0czZid3AzMG42YzJqcGNmdzYzZmd2NSJ9.BuBkmVXS61pvHErosbGCGA";

const Infographics = () => {
  const [filters, setFilters] = useState({
    lat: "",
    long: "",
    radius: "",
    from: "",
    to: "",
    speciesName: "",
    depthMin: "",
    depthMax: "",
    sea: "",
    state: "",
    userId: "",
    verified: false,
    totalWeightMin: "",
    totalWeightMax: "",
  });

  const [selectedCharts, setSelectedCharts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [data, setData] = useState([]);
  const [showMapAndFilters, setShowMapAndFilters] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]); // Store map markers for cleanup

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      verified: !prevFilters.verified,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value || (typeof value === "boolean" && value === true)) {
        if (key === "depthMin" || key === "depthMax") {
          if (filters.depthMin && filters.depthMax) {
            requestData.depth = {
              min: parseFloat(filters.depthMin),
              max: parseFloat(filters.depthMax),
            };
          }
        } else if (key === "totalWeightMin" || key === "totalWeightMax") {
          if (filters.totalWeightMin && filters.totalWeightMax) {
            requestData.total_weight = {
              min: parseFloat(filters.totalWeightMin),
              max: parseFloat(filters.totalWeightMax),
            };
          }
        } else {
          requestData[key] =
            key.includes("lat") ||
            key.includes("long") ||
            key.includes("radius")
              ? parseFloat(value)
              : value;
        }
      }
    }

    setLoading(true); // Show loader while fetching data
    try {
      const response = await axios.post(
        "https://aquadb-server.onrender.com/scientist/filter-data",
        requestData
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false); // Hide loader once data is fetched
    }
  };

  // const navigate = useNavigate();
  // useEffect(() => {
  //   const user = localStorage.getItem("aquaUser");
  //   const userInSession = JSON.parse(user);
  //   if (userInSession && userInSession.userType !== "scientist") {
  //     toast.error("You cannot access this page");
  //     navigate("/signin");
  //   }
  // }, []);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
    XLSX.writeFile(workbook, "filtered_data.xlsx");
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true); // Show loader while fetching data
    try {
      const response = await axios.post(
        "https://aquadb-server.onrender.com/scientist/filter-data"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false); // Hide loader once data is fetched
    }
  };

  const calculateSpeciesStats = () => {
    const speciesMap = new Map();
    data.forEach((catchDetail) => {
      catchDetail.species.forEach((s) => {
        if (s.name && s.catch_weight) {
          speciesMap.set(
            s.name,
            (speciesMap.get(s.name) || 0) + s.catch_weight
          );
        }
      });
    });
    const speciesCounts = Array.from(speciesMap.entries());

    const mostCommonSpecies = speciesCounts.length
      ? speciesCounts.reduce((mostCommon, current) =>
          current[1] > mostCommon[1] ? current : mostCommon
        )
      : ["No species", 0];

    const averageWeight =
      speciesCounts.length > 0
        ? speciesCounts.reduce((sum, [, weight]) => sum + weight, 0) /
          speciesCounts.length
        : 0;

    return { speciesCounts, mostCommonSpecies, averageWeight };
  };

  const { speciesCounts, mostCommonSpecies, averageWeight } =
    calculateSpeciesStats();

  const speciesNames = speciesCounts.map(([species]) => species);
  const speciesWeights = speciesCounts.map(([, weight]) => weight);

  const barData = {
    labels: speciesNames,
    datasets: [
      {
        label: "Species Distribution",
        data: speciesWeights,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartTypes = [
    "Area Chart",
    "Bar Chart",
    "Bubble Chart",
    "Doughnut and Pie Charts",
    "Line Chart",
    "Mixed Chart Types",
    "Polar Area Chart",
    "Radar Chart",
    "Scatter Chart",
  ];

  const handleSelectChart = (chartType) => {
    if (!selectedCharts.includes(chartType) && selectedCharts.length < 4) {
      setSelectedCharts((prev) => [...prev, chartType]);
    } else if (selectedCharts.includes(chartType)) {
      setSelectedCharts((prev) => prev.filter((chart) => chart !== chartType));
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApplySelection = () => {
    setIsModalOpen(false); // Close the modal
  };

  const renderChartComponent = (chartType) => {
    switch (chartType) {
      case "Area Chart":
        return <AreaChart />;
      case "Bar Chart":
        return <BarChart />;
      case "Bubble Chart":
        return <BubbleChart />;
      case "Doughnut and Pie Charts":
        return <DoughnutPieChart />;
      case "Line Chart":
        return <LineChart />;
      case "Mixed Chart Types":
        return <MixedChart />;
      case "Polar Area Chart":
        return <PolarAreaChart />;
      case "Radar Chart":
        return <RadarChart />;
      case "Scatter Chart":
        return <ScatterChart />;
      default:
        return <div>Chart Not Found</div>;
    }
  };

  return (
    // <AnimationWrapper className="md:flex-row h-screen rounded-[3xl]">
    //   <div
    //     style={{ borderRadius: "2rem 0 0 2rem" }}
    //     className="bg-[#f4f7fc] p-6"
    //   >

    //     {/* Toggle Button */}
    //     <div className="flex justify-between items-center mb-8">
    //       <h1 className="text-4xl font-bold">Dashboard / Overview</h1>

    //       <div className="p-8">
    //         <h1 className="text-2xl font-bold mb-4">
    //           Dynamic Chart Visualization
    //         </h1>
    //         {/* <ChartSelector
    //           onSelectChart={handleSelectChart}
    //           selectedCharts={selectedCharts}
    //         /> */}

    //         <div className="mt-8 grid grid-cols-2 gap-4">
    //           {selectedCharts.map((chart) => (
    //             <div key={chart} className="p-4 border rounded shadow-lg">
    //               <button
    //                 className="mb-2 bg-red-500 text-white px-2 py-1 rounded"
    //                 onClick={() => handleRemoveChart(chart)}
    //               >
    //                 Remove {chart}
    //               </button>
    //               {renderChartComponent(chart)}
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       <div className="p-8">
    //         <h1 className="text-2xl font-bold mb-4">Dynamic Chart Selection</h1>

    //         {/* Open Modal Button */}
    //         <button
    //           className="py-2 px-4 bg-blue-500 text-white rounded"
    //           onClick={handleOpenModal}
    //         >
    //           Select Charts
    //         </button>

    //         {/* Modal to select charts */}
    //         {isModalOpen && (
    //           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    //             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
    //               <h3 className="text-xl font-bold mb-4">
    //                 Select Up to 4 Charts
    //               </h3>
    //               <div className="grid grid-cols-2 gap-4 mb-4">
    //                 {chartTypes.map((type) => (
    //                   <button
    //                     key={type}
    //                     className={`py-2 px-4 rounded ${
    //                       selectedCharts.includes(type)
    //                         ? "bg-gray-300 text-gray-700"
    //                         : "bg-blue-500 text-white hover:bg-blue-600"
    //                     }`}
    //                     onClick={() => handleSelectChart(type)}
    //                     disabled={
    //                       selectedCharts.length >= 4 &&
    //                       !selectedCharts.includes(type)
    //                     }
    //                   >
    //                     {type}
    //                   </button>
    //                 ))}
    //               </div>

    //               <div className="flex justify-between">
    //                 <button
    //                   className="py-2 px-4 bg-gray-500 text-white rounded"
    //                   onClick={handleCloseModal}
    //                 >
    //                   Close
    //                 </button>
    //                 <button
    //                   className="py-2 px-4 bg-blue-500 text-white rounded"
    //                   onClick={handleApplySelection}
    //                 >
    //                   Apply
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         )}

    //         {/* Render Selected Charts as Cards */}
    //         <div className="mt-8 grid grid-cols-2 gap-4">
    //           {selectedCharts.map((chart) => (
    //             <div key={chart} className="p-4 border rounded shadow-lg">
    //               <h4 className="font-bold mb-2">{chart}</h4>
    //               {renderChartComponent(chart)}
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       {/* chart selector button */}
    //       <div className="flex">
    //         <div className="flex items-center">
    //           <button onClick={downloadExcel} className="text-[green] text-xl">
    //             <i class="fas fa-file-csv mx-3"></i>Download CSV
    //           </button>
    //           <span className="text-black text-xl mx-6">/</span>
    //           <button className="text-[red] text-xl">
    //             <i class="fas fa-file-pdf mx-3"></i>Download PDF
    //           </button>
    //         </div>

    //         <div class="flex items-center mx-10 w-[30vw]">
    //           <div className="relative w-full">
    //             <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
    //               <svg
    //                 class="w-4 h-4 text-gray-500 dark:text-gray-400"
    //                 aria-hidden="true"
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="none"
    //                 viewBox="0 0 18 20"
    //               >
    //                 <path
    //                   stroke="currentColor"
    //                   stroke-linecap="round"
    //                   stroke-linejoin="round"
    //                   stroke-width="2"
    //                   d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
    //                 />
    //               </svg>
    //             </div>
    //             <input
    //               type="text"
    //               id="simple-search"
    //               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //               placeholder="Search fish record..."
    //               required
    //               style={{
    //                 borderRadius: "3rem",
    //                 padding: "1rem 2rem 1rem 2.5rem",
    //                 width: "100%",
    //               }}
    //             />
    //           </div>
    //           <button
    //             type="submit"
    //             class="p-4 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //             style={{ borderRadius: "3rem" }}
    //           >
    //             <svg
    //               class="w-4 h-4"
    //               aria-hidden="true"
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 20 20"
    //             >
    //               <path
    //                 stroke="currentColor"
    //                 stroke-linecap="round"
    //                 stroke-linejoin="round"
    //                 stroke-width="2"
    //                 d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
    //               />
    //             </svg>
    //           </button>
    //         </div>

    //         <div
    //           style={{
    //             borderRadius: "50%",
    //             height: "3rem",
    //             width: "3rem",
    //             backgroundImage: "url(../../public/prof_img.png)",
    //             backgroundSize: "cover",
    //             backgroundRepeat: "no-repeat",
    //           }}
    //         ></div>
    //       </div>
    //     </div>

    //     {/* Loader */}
    //     {loading && (
    //       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    //         <div className="text-white text-lg">Loading...</div>
    //       </div>
    //     )}

    //     {/* Left Side: Map and Filters */}

    //     <div className="flex flex-col items-center w-full h-auto p-4">
    //       <div className="w-full max-w-4xl rounded-lg bg-gray-100 shadow-md p-6">
    //         <div className="h-full w-full rounded-lg bg-white p-6 shadow-sm">
    //           <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>
    //           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    //             {/* Compact Fields */}
    //             <div className="grid grid-cols-2 gap-4">
    //               {/* Latitude */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   Latitude
    //                 </label>
    //                 <input
    //                   type="number"
    //                   name="lat"
    //                   value={filters.lat}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* Longitude */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   Longitude
    //                 </label>
    //                 <input
    //                   type="number"
    //                   name="long"
    //                   value={filters.long}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* Radius */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   Radius (km)
    //                 </label>
    //                 <input
    //                   type="number"
    //                   name="radius"
    //                   value={filters.radius}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* Species Name */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   Species Name
    //                 </label>
    //                 <input
    //                   type="text"
    //                   name="speciesName"
    //                   value={filters.speciesName}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* Depth Min */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   Depth Min
    //                 </label>
    //                 <input
    //                   type="number"
    //                   name="depthMin"
    //                   value={filters.depthMin}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* Depth Max */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   Depth Max
    //                 </label>
    //                 <input
    //                   type="number"
    //                   name="depthMax"
    //                   value={filters.depthMax}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* From Date */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   From Date
    //                 </label>
    //                 <input
    //                   type="date"
    //                   name="from"
    //                   value={filters.from}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* To Date */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   To Date
    //                 </label>
    //                 <input
    //                   type="date"
    //                   name="to"
    //                   value={filters.to}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* Sea */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   Sea
    //                 </label>
    //                 <input
    //                   type="text"
    //                   name="sea"
    //                   value={filters.sea}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* State */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   State
    //                 </label>
    //                 <input
    //                   type="text"
    //                   name="state"
    //                   value={filters.state}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* Weight Min */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   Wt. Min (kg)
    //                 </label>
    //                 <input
    //                   type="number"
    //                   name="totalWeightMin"
    //                   value={filters.totalWeightMin}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //               {/* Weight Max */}
    //               <div>
    //                 <label className="text-sm font-medium text-gray-700">
    //                   Wt. Max (kg)
    //                 </label>
    //                 <input
    //                   type="number"
    //                   name="totalWeightMax"
    //                   value={filters.totalWeightMax}
    //                   onChange={handleChange}
    //                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-blue-500 focus:outline-none"
    //                 />
    //               </div>
    //             </div>
    //             {/* Submit Button */}
    //             <button
    //               type="submit"
    //               className="w-full mt-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-500"
    //             >
    //               Apply Filters
    //             </button>
    //           </form>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Bottom: Data Table */}
    //     <div
    //       className="w-full bg-white mt-5 p-4 pb-6 rounded-lg overflow-y-auto"
    //       style={{ boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px" }}
    //     >
    //       <Typography variant="h6" color="textSecondary">
    //         Data Table
    //       </Typography>
    //       <DataDisplay data={data} />
    //     </div>
    //   </div>
    // </AnimationWrapper>\

    <AreaChart />
  );
};

export default Infographics;

{
  /*  */
}

