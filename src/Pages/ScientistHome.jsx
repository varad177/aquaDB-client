import React, { useEffect, useState, useRef, useContext } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DataDisplay from "../Components/Scientist/ScientistDataDisplay";
// import * as XLSX from "xlsx";
import AnimationWrapper from "./Animation-page";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Button, Modal } from "flowbite-react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

import ExcelJS from "exceljs";
import Chart from "chart.js/auto";

import Clock from "../Components/CircularClock";
import MapboxVisualization from "./Admin-map";

// Register the required components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

mapboxgl.accessToken =
  "pk.eyJ1Ijoic25laGFkMjgiLCJhIjoiY2x0czZid3AzMG42YzJqcGNmdzYzZmd2NSJ9.BuBkmVXS61pvHErosbGCGA";

const ScientistHome = () => {
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
  const [data, setData] = useState([]);
  const [features, setFeatures] = useState([
    "average depth",
    "total fish catch",
    "common species",
    "clock"
  ]);

  const [selectedFeature, setselectedFeature] = useState(features);
  const [featureCount, setfeatureCount] = useState(4);

  const [showMapAndFilters, setShowMapAndFilters] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const [mapMode, setMapMode] = useState("markers"); // New state for map mode

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]); // Store map markers for cleanup
  const heatmapLayerId = "heatmap-layer";
  const clusterLayerId = "clusters";
  const [uniqueSpecies, setuniqueSpecies] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [uniqueCount, setuniqueCount] = useState(null);
  const [catchWeight, setCatchWeight] = useState(null);


  const fetchData = async () => {
    try {
      const response = await axios.post("https://aquadb-server.onrender.com/scientist/getFishCount", {
        fishName: selectedValue
      }) 
      setuniqueCount(response.data.count);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchWeight = async () => {
    try {
      const response = await axios.post("https://aquadb-server.onrender.com/scientist/getFishWeight", {
        fishName: selectedWeight
      }) 
      setCatchWeight(response.data.totalCatchWeight);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  
  
  
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleWeightChange = (event) => {
    setSelectedWeight(event.target.value);
  }

  useEffect(() => {
    if (selectedWeight) {
      fetchWeight();
    }
  }, [selectedWeight]);


  useEffect(() => {
    if (selectedValue) {
      fetchData();
    }
  }, [selectedValue]);

  useEffect(() => {
    const getUniqueSpecies = async (req, res) => {
      const response = await axios.get("https://aquadb-server.onrender.com/scientist/unique-species");

      setuniqueSpecies(response.data);
      console.log(response.data);
    }

    getUniqueSpecies();
  }, [])
  

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
       { filter: requestData}
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false); // Hide loader once data is fetched
    }
  };

  const navigate = useNavigate();
  // useEffect(() => {

  //   const user = localStorage.getItem('aquaUser');
  //   const userInSession = JSON.parse(user);
  //   if (userInSession && userInSession.userType !== 'scientist') {
  //     toast.error('You cannot access this page');
  //     navigate('/signin');
  //   }

  // }, []);

  const toggleMapAndFilters = () => {
    setShowMapAndFilters(!showMapAndFilters);
  };

  const toggleMapMode = (mode) => {
    setMapMode(mode);
  };

  // const downloadExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
  //   XLSX.writeFile(workbook, "filtered_data.xlsx");
  // };

  const downloadExcelWithCharts = async () => {
    try {
      if (!data || data.length === 0) {
        console.error("No data available for export.");
        return;
      }
  
      // Chart Data Preparation
      const stateNames = [...new Set(data.map((item) => item.state))];
      const avgDepthsByState = stateNames.map((state) => {
        const filteredData = data.filter((item) => item.state === state);
        const totalDepth = filteredData.reduce(
          (sum, curr) => sum + parseFloat(curr.depth || 0),
          0
        );
        return totalDepth / filteredData.length || 0; // Calculate average depth
      });
  
      const seas = [...new Set(data.map((item) => item.sea))];
      const seaCounts = seas.map((sea) =>
        data.filter((item) => item.sea === sea).length
      );
  
      const dates = data.map((item) => new Date(item.date).toLocaleDateString());
      const depths = data.map((item) => item.depth);
  
      const latitudes = data.map((item) => item.latitude);
      const depthsForScatter = data.map((item) => item.depth);
  
      const longitudes = data.map((item) => item.longitude);
  
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const monthCounts = months.map((month, index) =>
        data.filter((item) => new Date(item.date).getMonth() === index).length
      );
  
      // Workbook and Worksheet
      const workbook = new ExcelJS.Workbook();
      const dataSheet = workbook.addWorksheet("Filtered Data");
      const chartSheet = workbook.addWorksheet("Chart Sheet");
  
      // Populate Data Sheet
      const columns = Object.keys(data[0] || {}).map((key) => ({
        header: key,
        key: key,
      }));
      dataSheet.columns = columns;
      data.forEach((row) => {
        dataSheet.addRow(row);
      });
  
      // Generate Charts
      const generateChart = (type, labels, dataset, chartTitle, colors) => {
        const chartCanvas = document.createElement("canvas");
        chartCanvas.width = 800;
        chartCanvas.height = 400;
  
        // Set solid white background
        const ctx = chartCanvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, chartCanvas.width, chartCanvas.height);
  
        const chart = new Chart(ctx, {
          type,
          data: {
            labels,
            datasets: [
              {
                label: chartTitle,
                data: dataset,
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 3, // Bold lines
              },
            ],
          },
          options: {
            responsive: false,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: chartTitle },
            },
            scales: type !== "pie" ? { y: { beginAtZero: true } } : undefined,
          },
        });
  
        // Wait for the chart to be fully rendered
        return new Promise((resolve) => {
          chart.update(); // Make sure the chart is fully rendered
          setTimeout(() => resolve(chartCanvas), 1000); // Wait for 1 second before returning
        });
      };
  
      // Define color schemes
      const colorSchemes = [
        { background: "#FF6384", border: "#FF6384" },
        { background: "#36A2EB", border: "#36A2EB" },
        { background: "#FFCE56", border: "#FFCE56" },
        { background: "#4BC0C0", border: "#4BC0C0" },
        { background: "#9966FF", border: "#9966FF" },
        { background: "#FF9F40", border: "#FF9F40" },
      ];
  
      const chartCanvases = [
        await generateChart(
          "bar",
          stateNames,
          avgDepthsByState,
          "Average Depth by State",
          colorSchemes[0]
        ),
        await generateChart("line", dates, depths, "Depth Over Time", colorSchemes[1]),
        await generateChart("bar", seas, seaCounts, "Entries by Sea", colorSchemes[2]),
        await generateChart(
          "scatter",
          latitudes,
          depthsForScatter,
          "Depth vs Latitude",
          colorSchemes[3]
        ),
        await generateChart("bar", months, monthCounts, "Entries by Month", colorSchemes[4]),
        await generateChart(
          "scatter",
          longitudes,
          depths,
          "Depth vs Longitude",
          colorSchemes[5]
        ),
      ];
  
      // Style Chart Sheet Header
      chartSheet.getCell("A1").value = "Filtered Data Infographics (Summary)";
      chartSheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FF5A5A" } };
      chartSheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
      chartSheet.mergeCells("A1:M2");
  
      // Add Charts in Grid Layout
      const CHART_WIDTH = 600;
      const CHART_HEIGHT = 400;
      const CHARTS_PER_ROW = 3;
      const startRow = 4; // Leave space after header
  
      for (let i = 0; i < chartCanvases.length; i++) {
        const row = startRow + Math.floor(i / CHARTS_PER_ROW) * 24; // Space between rows
        const col = (i % CHARTS_PER_ROW) * 10; // Space between columns
        const chartBlob = await new Promise((resolve) =>
          chartCanvases[i].toBlob((blob) => resolve(blob), "image/png")
        );
        const imageId = workbook.addImage({
          buffer: await chartBlob.arrayBuffer(),
          extension: "png",
        });
        chartSheet.addImage(imageId, {
          tl: { col, row },
          ext: { width: CHART_WIDTH, height: CHART_HEIGHT },
        });
      }
  
      // Write and Download
      const excelBuffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "filtered_data_with_multiple_charts.xlsx";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  // useEffect(() => {
  //   if (!map.current) {
  //     map.current = new mapboxgl.Map({
  //       container: mapContainer.current,
  //       style: 'mapbox://styles/mapbox/light-v11',
  //       center: [78.9629, 20.5937], // Centered over India
  //       zoom: 4,
  //     });
  //   }

  //   // Clear old markers
  //   markers.current.forEach((marker) => marker.remove());
  //   markers.current = [];

  // Add new markers
  // data.forEach((point) => {
  //   const marker = new mapboxgl.Marker()
  //     .setLngLat([point.longitude, point.latitude])
  //     .setPopup(
  //       new mapboxgl.Popup({ offset: 25 }).setHTML(`
  //         <div style="
  //           font-family: Arial, sans-serif;
  //           font-size: 14px;
  //           color: #333;
  //           background-color: #fff;
  //           border-radius: 8px;
  //           padding: 10px;
  //           box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  //           max-width: 250px;
  //           line-height: 1.5;
  //         ">
  //           <h3 style="
  //             margin: 0 0 10px;
  //             font-size: 16px;
  //             color: #007bff;
  //             text-align: center;
  //           ">
  //             ${point.species.map((s) => s.name).join(', ')}
  //           </h3>
  //           <p style="margin: 5px 0;"><strong>Sea:</strong> ${point.sea}</p>
  //           <p style="margin: 5px 0;"><strong>State:</strong> ${point.state}</p>
  //           <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(point.date).toLocaleDateString()}</p>
  //           <p style="margin: 5px 0;"><strong>Total Weight:</strong> ${point.total_weight} kg</p>
  //         </div>
  //       `)

  //     )
  //     .addTo(map.current); } )

  //     markers.current.push(marker);
  //   });

  //   // Adjust map bounds to fit all points
  //   if (data.length) {
  //     const bounds = new mapboxgl.LngLatBounds();
  //     data.forEach((point) => bounds.extend([point.longitude, point.latitude]));
  //     map.current.fitBounds(bounds, { padding: 50 });
  //   }

  // }, [data]);

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
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false); // Hide loader once data is fetched
    }
  };

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [78.9629, 20.5937], // Centered over India
        zoom: 4,
      });
    }

    // Clear existing layers and markers
    clearMapLayers();

    if (mapMode === "markers") {
      showMarkers();
    } else if (mapMode === "heatmap") {
      showHeatmap();
    } else if (mapMode === "clusters") {
      showClusters();
    }
  }, [mapMode, data]);

  const clearMapLayers = () => {
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    if (map.current.getLayer(heatmapLayerId))
      map.current.removeLayer(heatmapLayerId);
    if (map.current.getSource("heatmap-data"))
      map.current.removeSource("heatmap-data");
    if (map.current.getLayer(clusterLayerId))
      map.current.removeLayer(clusterLayerId);
    if (map.current.getSource("cluster-data"))
      map.current.removeSource("cluster-data");
  };

  const showMarkers = () => {
    data.forEach((point) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([point.longitude, point.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h3>${point.species.map((s) => s.name).join(", ")}</h3>
            <p><strong>Sea:</strong> ${point.sea}</p>
            <p><strong>State:</strong> ${point.state}</p>
            <p><strong>Date:</strong> ${new Date(
              point.date
            ).toLocaleDateString()}</p>
            <p><strong>Total Weight:</strong> ${point.total_weight} kg</p>
          `)
        )
        .addTo(map.current);
      markers.current.push(marker);
    });
  };

  const showHeatmap = () => {
    map.current.addSource("heatmap-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: data.map((point) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [point.longitude, point.latitude],
          },
        })),
      },
    });

    map.current.addLayer({
      id: heatmapLayerId,
      type: "heatmap",
      source: "heatmap-data",
      paint: {
        "heatmap-weight": 1,
        "heatmap-intensity": 2,
        "heatmap-radius": 15,
        "heatmap-opacity": 0.8,
      },
    });
  };

  const showClusters = () => {
    map.current.addSource("cluster-data", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: data.map((point) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [point.longitude, point.latitude],
          },
        })),
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.current.addLayer({
      id: clusterLayerId,
      type: "circle",
      source: "cluster-data",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#51bbd6",
        "circle-radius": ["step", ["get", "point_count"], 20, 50, 30, 100, 40],
      },
    });

    map.current.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "cluster-data",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 14,
      },
    });
  };

  const calculateSpeciesStats = () => {
    const speciesMap = new Map();
    data &&
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

  const [openModal, setOpenModal] = useState(false);
  const [communities, setCommunities] = useState([]);

  const fetchCommunities = async () => {
    const userInSession = localStorage.getItem("aquaUser");
    const { userId } = JSON.parse(userInSession);
    try {
      const response = await axios.post(
        "https://aquadb-server.onrender.com/scientist/fetch-communities",
        {
          creatorId: userId,
        }
      );
      if (Array.isArray(response.data)) {
        setCommunities(response.data);
      }
    } catch (error) {
      console.log("Error fetching communities");
    }
  };

  let shareToCommunity = async () => {
    console.log("varad");

    try {
      fetchCommunities();
      setOpenModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const sendDataForCommunity = async (id) => {
    const userInSession = localStorage.getItem("aquaUser");
    const { userId } = JSON.parse(userInSession);

    try {
      const response = await axios.post(
        "https://aquadb-server.onrender.com/scientist/insert-community-data",
        {
          uploadedBy: userId,
          communityId: id,
          dataArray: data,
        }
      );

      if ((response.status = 200)) {
        console.log("Data sent to community successfully");
        setOpenModal(false);
      }
    } catch (error) {
      console.log("Error fetching communities");
    }
  };


  const handleFeatureSelection = (feature) => {
    if (selectedFeature.includes(feature)) {
      // Remove the feature if it's already selected
      setselectedFeature(selectedFeature.filter((item) => item !== feature));
      setfeatureCount(featureCount - 1);
    } else if(featureCount < 4) {   
      // Add the feature if it's not already selected
      setselectedFeature([...selectedFeature, feature]);
      setfeatureCount(featureCount + 1);
    } else {
      alert("Upto 4 features only");
    }
  };

  return (
    <>
      <AnimationWrapper className="md:flex-row  rounded-[3xl]">
        <div
          style={{ borderRadius: "2rem 0 0 2rem" }}
          className="bg-[#f4f7fc] p-6 h-screen"
        >
          {/* Toggle Button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Dashboard / Overview</h1>

            <div className="flex">
              

              <button
                className="relative p-3 rounded-xl text-sm font-medium bg-red-500 text-white"
                style={{ padding: "0 1rem 0 2rem" }}
                onClick={() => {
                  setOpenModal(true)
                  setselectedFeature(features);
                  }
                }
              >
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 20"
                  >
                    <path
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                    />
                  </svg>
                </div>
                Customize
              </button>

              <div class="flex items-center mx-5 w-[30vw]">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="simple-search"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search fish record..."
                    required
                    style={{
                      borderRadius: "3rem",
                      padding: "1rem 2rem 1rem 1.5rem",
                      width: "100%",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  class="p-4 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  style={{ borderRadius: "3rem" }}
                >
                  <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </button>
              </div>

              <div
                style={{
                  borderRadius: "50%",
                  height: "3rem",
                  width: "3rem",
                  backgroundImage: "url(../../public/prof_img.png)",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>
          </div>

          {/* Loader */}
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="text-white text-lg">Loading...</div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-6 h-1/3 mb-5">

            { features.includes("average depth") &&   <div
              className="bg-white rounded-xl p-4"
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px"}}>
              <Typography
                variant="h4"
                color="textSecondary"
                style={{ fontSize: "1rem" }}
              >
                Average Depth
              </Typography>
              <p className="text-4xl text-black font-bold mb-3">
                1505.70 meters
              </p>
              <Typography
                variant="h4"
                color="textSecondary"
                style={{ fontSize: "1rem" }}
              >
                Min: 0 <br />
                Max: 110120m
              </Typography>
            </div> }

            { features.includes("total fish catch") && <div
              className="bg-white rounded-xl p-4 text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px",
                backgroundImage: "url(../../public/sea3_bg.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }} >
              <Typography
                variant="h4"
                color="white"
                style={{ fontSize: "1rem" }}
              >
                Total Fish Catch
              </Typography>
              <p className="text-4xl text-white font-bold">
                16535 Kg <br />
                (In Total){" "}
              </p>
            </div> }

            {features.includes('common species') && <div
              className="bg-white rounded-xl p-4 text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px",
                backgroundImage: "url(../../public/sea3_bg.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }} >

              <Typography
                variant="h4"
                color="white"
                style={{ fontSize: "1rem" }} >
                Most Common Species
              </Typography>
              <p className="  text-4xl text-white font-bold">
                Mackeral (1950 kg)
              </p>
            </div> }

            {features.includes('clock') && <div
              className="bg-white rounded-xl p-4 mx-auto w-full"
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px" }} >
              <Clock />
            </div> }

            { features.includes('average catch') && <div
              onClick={() => handleFeatureSelection("average catch")}
              className="bg-white rounded-xl p-4 text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300 "
              style={{
                boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px",
                backgroundImage: "url(../../public/sea3_bg.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }} >

              <Typography
                variant="h4"
                color="white"
                style={{ fontSize: "1rem" }} >
                Average Catch
              </Typography>
              <p className="  text-4xl text-white font-bold">
                500 kg
              </p>
            </div> }

            { features.includes('current location') && <div
              className="bg-white rounded-xl p-4 text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px",
                backgroundImage: "url(../../public/sea3_bg.jpg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }} >

              <Typography
                variant="h4"
                color="white"
                style={{ fontSize: "1rem" }} >
                Current Location
              </Typography>
              <p className="  text-4xl text-white font-bold">
                Lingumpalli, Hyderabad
              </p>
            </div> }

            { features.includes('Unique Species Count') && <div
              className="bg-white rounded-xl p-4 text-black "
              style={{
                boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px"
              }} >

              <Typography
                variant="h4"
                style={{ fontSize: "1rem" }} >
                Unique Species Count
              </Typography>
              <div className="mt-4">
                <label htmlFor="fish-dropdown">Search Fish:</label>
                <select className="ml-2" value={selectedValue} onChange={handleSelectChange}> 
                  {uniqueSpecies.species.map((fish, index) => (
                    <option key={index} value={fish}>
                      {fish}
                    </option>
                  ))}
                </select>
              </div>

              { uniqueCount && <h1 className="font-bold text-3xl text-black mt-5">Total number of <br/> Data points of {selectedValue} is {uniqueCount}</h1> }
            </div> }

            { features.includes('Catch Weight') && <div
              className="bg-white rounded-xl p-4 text-black "
              style={{
                boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px",
              }} >

              <Typography
                variant="h4"
                style={{ fontSize: "1rem" }} >
                Catch Weight
              </Typography>
              <div className="mt-4">
                <label htmlFor="weight-dropdown">Search Fish:</label>
                <select className="ml-2" value={selectedWeight} onChange={handleWeightChange}> 
                  {uniqueSpecies.species.map((fish, index) => (
                    <option key={index} value={fish}>
                      {fish}
                    </option>
                  ))}
                </select>
              </div>

              { catchWeight && <h1 className="font-bold text-3xl text-black mt-5">Catch Weight of <br/> {selectedWeight} is {catchWeight} kg</h1> }

            </div> }
          </div>

          {/* Left Side: Map and Filters */}
          <div className="flex gap-4 w-full h-auto">
            <div className="w-[100vw] rounded-lg flex gap-6">
              <div
                className="relative w-2/3 bg-white rounded-2xl"
                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px" }}
              >
                <div
                  ref={mapContainer}
                  className="h-full bg-gray-700 rounded-2xl p-3 py-6"
                >
                  <span
                    className="relative p-3 rounded-xl text-xl font-medium bg-white text-black"
                    style={{ zIndex: 9 }}
                  >
                    Data Distribution{" "}
                  </span>
                </div>

                <div className="absolute top-0 right-0 flex flex-col h-full gap-3 p-6">
                  <button
                    className="p-3 w-full rounded-xl text-sm font-medium bg-blue-500 text-white mb-3"
                    style={{ zIndex: 9 }}
                    onClick={() => toggleMapMode("markers")}
                  >
                    Markers
                  </button>
                  <button
                    className=" p-3 w-full rounded-xl text-sm font-medium bg-green-500 text-white mb-3"
                    style={{ zIndex: 9 }}
                    onClick={() => toggleMapMode("heatmap")}
                  >
                    Heatmap
                  </button>
                  <button
                    className=" p-3 w-full rounded-xl text-sm font-medium bg-red-500 text-white"
                    style={{ zIndex: 9 }}
                    onClick={() => toggleMapMode("clusters")}
                  >
                    Clusters
                  </button>
                </div>
              </div>

              <div
                className="w-1/2 rounded-2xl bg-white text-black"
                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px" }}
              >
                <div className="h-auto rounded-lg shadow-md p-4 flex flex-col">
                  <Typography variant="h6" color="black">
                    Filters
                  </Typography>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col justify-between h-full mt-2"
                  >
                    {/* Compact Fields */}
                    <div className="grid grid-cols-4 gap-4 text-black">
                      {/* Latitude */}
                      <div>
                        <label className="text-sm font-medium">Latitude</label>
                        <input
                          type="number"
                          name="lat"
                          value={filters.lat}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* Longitude */}
                      <div>
                        <label className="text-sm font-medium">Longitude</label>
                        <input
                          type="number"
                          name="long"
                          value={filters.long}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* Radius */}
                      <div>
                        <label className="text-sm font-medium">
                          Radius (km)
                        </label>
                        <input
                          type="number"
                          name="radius"
                          value={filters.radius}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* Species Name */}
                      <div>
                        <label className="text-sm font-medium">
                          Species Name
                        </label>
                        <input
                          type="text"
                          name="speciesName"
                          value={filters.speciesName}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* Depth Min */}
                      <div>
                        <label className="text-sm font-medium">Depth Min</label>
                        <input
                          type="number"
                          name="depthMin"
                          value={filters.depthMin}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* Depth Max */}
                      <div>
                        <label className="text-sm font-medium">Depth Max</label>
                        <input
                          type="number"
                          name="depthMax"
                          value={filters.depthMax}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* From Date */}
                      <div>
                        <label className="text-sm font-medium">From Date</label>
                        <input
                          type="date"
                          name="from"
                          value={filters.from}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* To Date */}
                      <div>
                        <label className="text-sm font-medium">To Date</label>
                        <input
                          type="date"
                          name="to"
                          value={filters.to}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* Sea */}
                      <div>
                        <label className="text-sm font-medium">Sea</label>
                        <input
                          type="text"
                          name="sea"
                          value={filters.sea}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* State */}
                      <div>
                        <label className="text-sm font-medium">State</label>
                        <input
                          type="text"
                          name="state"
                          value={filters.state}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* Weight Min */}
                      <div>
                        <label className="text-sm font-medium">
                          Wt. Min (kg)
                        </label>
                        <input
                          type="number"
                          name="totalWeightMin"
                          value={filters.totalWeightMin}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                      {/* Weight Max */}
                      <div>
                        <label className="text-sm font-medium">
                          Wt. Max (kg)
                        </label>
                        <input
                          type="number"
                          name="totalWeightMax"
                          value={filters.totalWeightMax}
                          onChange={handleChange}
                          className="mt-1 p-1 border border-black bg-transparent text-white rounded-md w-full focus:ring-1 focus:ring-white"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                  
                  </form>
                </div>
              </div>

              {/* Left Side: Map and Filters */}
            </div>
          </div>

          {/* Bottom: Data Table */}
          {/* <div className="w-full bg-white mt-5 p-4 pb-6 rounded-lg overflow-y-auto" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px" }}>
                            <Typography variant="h6" color="textSecondary">
                              Data Table
                            </Typography>
                            <DataDisplay data={data} />
                          </div> */}
        </div>
      </AnimationWrapper>

      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="bg-gray-900 text-white"
      >
        {/* Modal Header */}
        <Modal.Header className="bg-gray-800 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Customize your screen (select 4 features)
          </h2>
        </Modal.Header>

        {/* Modal Body */}
        <Modal.Body className="bg-gray-900">
          <div className=" grid grid-cols-4 grid-rows-2 gap-4">

          {[
            "average depth",
            "total fish catch",
            "common species",
            "clock",
            "average catch",
            "current location",
            "Unique Species Count",
            "Catch Weight",
          ].map((feature, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 text-white h-full ${
                selectedFeature.includes(feature) ? "bg-blue-200" : "bg-white"
              }`}
              onClick={() => handleFeatureSelection(feature)}
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 3px 1px 7px 0px" }}
            >
              <Typography
                variant="h4"
                color="black"
                style={{ fontSize: "1rem" }}
              >
                {feature.charAt(0).toUpperCase() + feature.slice(1)}
              </Typography>
            </div>
          ))}

                
          </div>
        </Modal.Body>

        {/* Modal Footer */}

        <Modal.Footer className="bg-gray-800 border-t border-gray-700 flex" style={{flexDirection: 'row-reverse',}}>
          <button
            onClick={() => {
              setOpenModal(false)
              setFeatures(selectedFeature);
              console.log(selectedFeature);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md m" >
            Select
          </button>
          
      

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ScientistHome;
