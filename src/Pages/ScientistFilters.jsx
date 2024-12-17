import React, { useState } from "react";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import MapboxVisualization2 from "../Components/Scientist/ScientistMap";
import ExcelJS from "exceljs";
import Chart from "chart.js/auto";
import ConfirmationModal from "../Components/ConfirmationModal";
import ScientistFileDownload from "../Components/Scientist/ScientistFileDownload";
import Loader from "../Components/Loader";
import ScientistLoader from "../Components/Scientist/ScientistLoader";
import toast from "react-hot-toast";
import FishCatchGraphs from "../Components/Scientist/FilterDataGraphs";
import FilterMap from "../Components/Scientist/FilterMap";
import MapboxVisualization from "./Admin-map";
import DataTable2 from "./VillageData";
import MapComponent from "./GetLatLong";


const FilterForm = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);
  let [fileLoader, setfileLoader] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  let [majorDataType, setMajorDataType] = useState("")

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
    totalWeightMin: "",
    totalWeightMax: "",
    dataType: null,
    zoneType: null,
    AbundanceOrAccurance: "",
    region: ""
  });


  let handleMap = () => {
    setIsModalOpen4(true)
  }

  let [msg, setMsg] = useState("confirm please")
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  let [message, setMessage] = useState("");
  let [Visualize, setVisualize] = useState(false);
  const [activeTab, setActiveTab] = useState('PFZ/NON-PFZ'); // 'data' as the initial active tab
  let [tag, setTag] = useState("data");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: prevFilters[type] === value ? null : value,
    }));
  };

  


  const [filters2, setFilters2] = useState({ date: "", latitude: "", longitude: "" });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters2((prev) => ({ ...prev, [name]: value }));
  };


  let [vf, svf] = useState({})

  const submit = async () => {


    if (activeTab == "Landing-Village") {
      svf(filters2)
      setOpenModal(false)
      return
    } {
      isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-3xl overflow-auto max-h-[80vh]">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Species Data</h2>
            <div className="overflow-auto">
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">Species</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(modalContent).map(([key, value], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-300 px-4 py-2 text-left capitalize">
                        {key.replace(/\./g, " ")}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )
    }

    setMessage("Loading Data.. Please Wait")
    setOpenModal(false)
    const requestData = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value !== "" && value !== null && value !== undefined) {
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
        } else if (key === "dataType" || key === "zoneType") {
          requestData[key] = value;
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

    setLoading(true);
    try {
      const response = await axios.post("https://aquadb-server.onrender.com/scientist/filter-data", {
        filter: requestData,
        majorDataType: activeTab
      });
      setData(response.data);
      console.log(response.data);
      setOpenModal(false)
      setLoading(false);
      toast.success("Data Loaded Successfully");
    } catch (error) {
      setData(null)
      toast.error(error.response.data.message || "No data available");

      console.error("Error fetching filtered data:", error);
    } finally {
      setLoading(false);

      setOpenModal(false);
    }
  };

  const [modalData, setModalData] = useState(null); // Stores data for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");

  const handlenameChange = (e) => {
    setName(e.target.value);
  };
  const [openModaln, setOpenModaln] = useState(false);

  const openModal2 = (species) => {
    setModalData(species);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const truncateDecimals = (value, decimals) => {
    return Number(value).toFixed(decimals);
  };

  const downloadExcelWithCharts = async (fileType) => {
    setfileLoader(true);
    try {
      // Check if data is valid
      if (!Array.isArray(data) || data.length === 0) {
        console.error("No valid data available for export.");
        return;
      }

      // Prepare data for charts
      const stateNames = [...new Set(data.map((item) => item.state))];
      const seaNames = [...new Set(data.map((item) => item.sea))];

      const speciesCounts = {};
      const seaSpeciesCounts = {};
      const stateSpeciesCounts = {};

      data.forEach((item) => {
        item.species.forEach(({ name, catch_weight }) => {
          speciesCounts[name] = (speciesCounts[name] || 0) + catch_weight;
          seaSpeciesCounts[item.sea] = seaSpeciesCounts[item.sea] || {};
          seaSpeciesCounts[item.sea][name] =
            (seaSpeciesCounts[item.sea][name] || 0) + catch_weight;

          stateSpeciesCounts[item.state] = stateSpeciesCounts[item.state] || {};
          stateSpeciesCounts[item.state][name] =
            (stateSpeciesCounts[item.state][name] || 0) + catch_weight;
        });
      });

      // Flatten species counts for charts
      const speciesLabels = Object.keys(speciesCounts);
      const speciesData = Object.values(speciesCounts);

      // Workbook and Worksheet
      const workbook = new ExcelJS.Workbook();
      const dataSheet = workbook.addWorksheet("Filtered Data");
      const chartSheet = workbook.addWorksheet("Chart Sheet");

      // Populate Data Sheet
      const flattenedData = data.map((item) => {
        const speciesNames = item.species.map((s) => s.name).join(", ");
        const speciesWeights = item.species
          .map((s) => s.catch_weight)
          .join(", ");
        return {
          ...item,
          species_names: speciesNames,
          species_weights: speciesWeights,
        };
      });
      const excludedColumns = ["_id", "userId", "__v", "dataId"]; // Specify the columns to exclude

      const columns = Object.keys(flattenedData[0] || {})
        .filter((key) => !excludedColumns.includes(key)) // Exclude unwanted columns
        .map((key) => ({
          header: key,
          key: key,
        }));

      dataSheet.columns = columns;

      flattenedData.forEach((row) => {
        const filteredRow = Object.keys(row)
          .filter((key) => !excludedColumns.includes(key)) // Remove unwanted keys from rows
          .reduce((acc, key) => {
            acc[key] = row[key];
            return acc;
          }, {});
        dataSheet.addRow(filteredRow);
      });

      // Generate Charts
      const generateChart = async (
        type,
        labels,
        dataset,
        chartTitle,
        colors
      ) => {
        const chartCanvas = document.createElement("canvas");
        chartCanvas.width = 800;
        chartCanvas.height = 400;

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
                borderWidth: 2,
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

        return new Promise((resolve) => {
          chart.update();
          setTimeout(() => resolve(chartCanvas), 1000);
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
          "pie",
          speciesLabels,
          speciesData,
          "Total Species Distribution",
          colorSchemes[0]
        ),
        await generateChart(
          "bar",
          stateNames,
          stateNames.map((state) =>
            Object.values(stateSpeciesCounts[state] || {}).reduce(
              (a, b) => a + b,
              0
            )
          ),
          "Total Weight by State",
          colorSchemes[1]
        ),
        await generateChart(
          "bar",
          seaNames,
          seaNames.map((sea) =>
            Object.values(seaSpeciesCounts[sea] || {}).reduce(
              (a, b) => a + b,
              0
            )
          ),
          "Total Weight by Sea",
          colorSchemes[2]
        ),
        await generateChart(
          "line",
          speciesLabels,
          speciesLabels.map((label) => speciesCounts[label] || 0),
          "Species Catch Trends",
          colorSchemes[3]
        ),
        await generateChart(
          "doughnut",
          speciesLabels,
          speciesData,
          "Species Distribution Doughnut",
          colorSchemes[4]
        ),
        await generateChart(
          "radar",
          stateNames,
          stateNames.map((state) =>
            Object.values(stateSpeciesCounts[state] || {}).reduce(
              (a, b) => a + b,
              0
            )
          ),
          "State Comparison Radar",
          colorSchemes[5]
        ),
      ];

      // Style Chart Sheet Header
      chartSheet.getCell("A1").value = "Filtered Data Infographics (Summary)";
      chartSheet.getCell("A1").font = {
        bold: true,
        size: 16,
        color: { argb: "FF5A5A" },
      };
      chartSheet.getCell("A1").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      chartSheet.mergeCells("A1:M2");

      // Add Charts in Grid Layout
      const CHART_WIDTH = 600;
      const CHART_HEIGHT = 400;
      const CHARTS_PER_ROW = 2;
      const startRow = 4;

      for (let i = 0; i < chartCanvases.length; i++) {
        const row = startRow + Math.floor(i / CHARTS_PER_ROW) * 24;
        const col = (i % CHARTS_PER_ROW) * 10;
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
      link.download = `filtered_data_with_multiple_charts.${fileType}`;
      link.click();
      URL.revokeObjectURL(link.href);
      setfileLoader(false);
    } catch (error) {
      setfileLoader(false);
      console.error("Error generating Excel file:", error);
    }
  };

  let [openModale, setOpenModale] = useState(false);

  const [emails, setEmails] = useState([]);

  let emailModel = () => {
    setOpenModale(true);
  };

  const downloadExcelWithCharts2 = async () => {
    setLoading(true);
    setOpenModale(false);

    try {
      // Check if data is valid
      if (!Array.isArray(data) || data.length === 0) {
        console.error("No valid data available for export.");
        return;
      }

      // Prepare data for charts
      const stateNames = [...new Set(data.map((item) => item.state))];
      const seaNames = [...new Set(data.map((item) => item.sea))];

      const speciesCounts = {};
      const seaSpeciesCounts = {};
      const stateSpeciesCounts = {};

      data.forEach((item) => {
        item.species.forEach(({ name, catch_weight }) => {
          speciesCounts[name] = (speciesCounts[name] || 0) + catch_weight;
          seaSpeciesCounts[item.sea] = seaSpeciesCounts[item.sea] || {};
          seaSpeciesCounts[item.sea][name] =
            (seaSpeciesCounts[item.sea][name] || 0) + catch_weight;

          stateSpeciesCounts[item.state] = stateSpeciesCounts[item.state] || {};
          stateSpeciesCounts[item.state][name] =
            (stateSpeciesCounts[item.state][name] || 0) + catch_weight;
        });
      });

      // Flatten species counts for charts
      const speciesLabels = Object.keys(speciesCounts);
      const speciesData = Object.values(speciesCounts);

      // Workbook and Worksheet
      const workbook = new ExcelJS.Workbook();
      const dataSheet = workbook.addWorksheet("Filtered Data");
      const chartSheet = workbook.addWorksheet("Chart Sheet");

      // Populate Data Sheet
      const flattenedData = data.map((item) => {
        const speciesNames = item.species.map((s) => s.name).join(", ");
        const speciesWeights = item.species
          .map((s) => s.catch_weight)
          .join(", ");
        return {
          ...item,
          species_names: speciesNames,
          species_weights: speciesWeights,
        };
      });

      const columns = Object.keys(flattenedData[0] || {}).map((key) => ({
        header: key,
        key: key,
      }));
      dataSheet.columns = columns;
      flattenedData.forEach((row) => {
        dataSheet.addRow(row);
      });

      // Generate Charts
      setMessage("Wait!... Creating Excel...");
      // Simulate creating Excel file
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Replace with actual Excel creation logic

      setMessage("Adding Charts in Excel file...");
      const generateChart = async (
        type,
        labels,
        dataset,
        chartTitle,
        colors
      ) => {
        const chartCanvas = document.createElement("canvas");
        chartCanvas.width = 800;
        chartCanvas.height = 400;

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
                borderWidth: 2,
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

        return new Promise((resolve) => {
          chart.update();
          setTimeout(() => resolve(chartCanvas), 1000);
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
          "pie",
          speciesLabels,
          speciesData,
          "Total Species Distribution",
          colorSchemes[0]
        ),
        await generateChart(
          "bar",
          stateNames,
          stateNames.map((state) =>
            Object.values(stateSpeciesCounts[state] || {}).reduce(
              (a, b) => a + b,
              0
            )
          ),
          "Total Weight by State",
          colorSchemes[1]
        ),
        await generateChart(
          "bar",
          seaNames,
          seaNames.map((sea) =>
            Object.values(seaSpeciesCounts[sea] || {}).reduce(
              (a, b) => a + b,
              0
            )
          ),
          "Total Weight by Sea",
          colorSchemes[2]
        ),
        await generateChart(
          "line",
          speciesLabels,
          speciesLabels.map((label) => speciesCounts[label] || 0),
          "Species Catch Trends",
          colorSchemes[3]
        ),
        await generateChart(
          "doughnut",
          speciesLabels,
          speciesData,
          "Species Distribution Doughnut",
          colorSchemes[4]
        ),
        await generateChart(
          "radar",
          stateNames,
          stateNames.map((state) =>
            Object.values(stateSpeciesCounts[state] || {}).reduce(
              (a, b) => a + b,
              0
            )
          ),
          "State Comparison Radar",
          colorSchemes[5]
        ),
      ];

      // Style Chart Sheet Header
      chartSheet.getCell("A1").value = "Filtered Data Infographics (Summary)";
      chartSheet.getCell("A1").font = {
        bold: true,
        size: 16,
        color: { argb: "FF5A5A" },
      };
      chartSheet.getCell("A1").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      chartSheet.mergeCells("A1:M2");

      // Add Charts in Grid Layout
      const CHART_WIDTH = 600;
      const CHART_HEIGHT = 400;
      const CHARTS_PER_ROW = 2;
      const startRow = 4;

      for (let i = 0; i < chartCanvases.length; i++) {
        const row = startRow + Math.floor(i / CHARTS_PER_ROW) * 24;
        const col = (i % CHARTS_PER_ROW) * 10;
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

      // const link = document.createElement("a");
      // link.href = URL.createObjectURL(blob);
      // link.download = `filtered_data_with_multiple_charts.xlsx`;
      // link.click();
      // URL.revokeObjectURL(link.href);

      setMessage("sending Email...");
      const formData = new FormData();
      formData.append("file", blob, "filtered_data_with_multiple_charts.xlsx");

      emails.forEach((email) => formData.append("emails[]", email));

      try {
        await axios.post(
          "https://aquadb-server.onrender.com/scientist/sendEmail",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Excel file and email sent successfully!");
      } catch (error) {
        console.error("Error sending email:", error);
        toast.error("Failed to send email. Check console for details.");
      }

      setLoading(false);
      setMessage("");
    } catch (error) {
      setfileLoader(false);
      console.error("Error generating Excel file:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen3(false);
  };

  const handleSaveData = async () => {
    if (!name) {
      toast.error("Please enter name first");
      return;
    }

    setOpenModaln(false);

    let userInSession = localStorage.getItem("aquaUser");
    let { userId } = JSON.parse(userInSession);

    // Show the confirmation modal
    setMsg("Do you really want to save the data?");
    setIsModalOpen3(true);

    const userConfirmed = await new Promise((resolve) => {
      const confirmHandler = (result) => {
        resolve(result); // Resolve the promise with the user's choice
        setIsModalOpen3(false); // Close the modal
      };

      // Pass confirmHandler to the modal
      setOnConfirm(() => confirmHandler);
    });

    if (!userConfirmed) {
      console.log("User canceled the save action.");
      return;
    }

    // Proceed with the API call
    const dataToSend = {
      uploadedBy: userId,
      data: data,
      filters,
      name,
    };

    setMessage("Wait Saving Your Filtered Data");
    setLoading(true);

    setError(null);
    setResponseMessage("");

    try {
      const response = await axios.post(
        "https://aquadb-server.onrender.com/scientist/saveScientistData",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResponseMessage(response.data.message || "Data saved successfully!");
      toast.success(response.data.message);
      setLoading(false);
    } catch (err) {
      console.error("Error saving data:", err);
      setLoading(false);
    } finally {
      setMessage("");
    }
  };

  const [onConfirm, setOnConfirm] = useState(() => () => { });

  const handleEmailChange = (e) => {
    const input = e.target.value;
    const emailArray = input
      .split(/[\s,]+/) // Split by commas or whitespace
      .filter((email) => email.trim() !== ""); // Remove empty strings
    setEmails(emailArray);
  };

  let [openModalc, setOpenModalc] = useState(false);
  const [communities, setCommunities] = useState([]);
  let shareToCommunity = async () => {
    console.log("varad");

    try {
      fetchCommunities();
      setOpenModalc(true);
    } catch (error) {
      console.error(error);
    }
  };

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
        setOpenModalc(false);
      }
    } catch (error) {
      console.log("Error fetching communities");
    }
  };

  const handleVisualize = async () => {
    setVisualize(true);
  };

  const handleTabClick = (t) => {
    if (!data) {
      return toast.error("Please Apply the filters first...");
    }
    setTag(t);
  };

  let openNameModel = () => {
    setOpenModaln(true)

  }

  let handleTab = (tab) => {
    setActiveTab(tab);
    setData([])
    setFilters({ ...filters, dataType: tab });






  }


  const tabs2 = [
    { label: "PFZ/NON-PFZ", value: "PFZ/NON-PFZ" },
    { label: "Landing Village", value: "Landing-Village" },
    { label: "GEO-REF", value: "GEO-REF" },
    { label: "ALL", value: "ALL" },
  ];


  const headers = [
    {
      header: "Species Name",
      key: "species",
      showIn: ["ALL", "GEO-REF", "PFZ/NON-PFZ"],
    },
    {
      header: "Latitude",
      key: "latitude",
      showIn: ["ALL", "GEO-REF", "PFZ/NON-PFZ"],
    },
    {
      header: "Longitude",
      key: "longitude",
      showIn: ["ALL", "GEO-REF", "PFZ/NON-PFZ"],
    },
    {
      header: "Depth",
      key: "depth",
      showIn: ["PFZ/NON-PFZ", "All"],
    },
    {
      header: "Total Weight (kg)",
      key: "total_weight",
      showIn: ["ALL", "GEO-REF", "PFZ/NON-PFZ"],
    },
    {
      header: "Sea",
      key: "sea",
      showIn: ["ALL", "GEO-REF", "PFZ/NON-PFZ"],
    },
    {
      header: "State",
      key: "state",
      showIn: ["ALL", "GEO-REF", "PFZ/NON-PFZ"],
    },
    {
      header: "Zone Type",
      key: "zoneType",
      showIn: ["ALL", "PFZ/NON-PFZ"],
    },
    {
      header: "Gear_type",
      key: "Gear_type",
      showIn: ["ALL", "GEO-REF"],
    },
    {
      header: "LANDINGNAME",
      key: "LANDINGNAME",
      showIn: ["ALL", "GEO-REF"],
    },
    {
      header: "Date",
      key: "date",
      showIn: ["ALL", "GEO-REF", "PFZ/NON-PFZ"],
    },
    {
      header: "region",
      key: "region",
      showIn: ["ALL", "GEO-REF", "PFZ/NON-PFZ"],
    },
  ];




  // Filter headers based on activeTab
  const filteredHeaders = headers.filter((header) =>
    header.showIn.includes(activeTab)


  );

  let lengthm = filteredHeaders.length;

  console.log(lengthm);






  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen">
      <nav className="w-full mb-4 px-12 flex items-center justify-between p-4 shadow-lg bg-white">
        <h1 className="text-3xl font-bold ">Apply Filters</h1>
        <Button onClick={() => setOpenModal(true)}>Apply Filters</Button>
      </nav>

      {
        fileLoader ? <ScientistFileDownload /> : loading ? <ScientistLoader message={message} />
          :
          <>
            <div className="min-h-screen flex gap-4">



              <div className="w-[80%] p-4 h-auto shadow-xl bg-white rounded-lg overflow-hidden">
              <div className="w-full bg-gray-50 flex items-center justify-between px-6 shadow-md rounded-t-lg border-b">
  {tabs2.map((tab) => (
    <div
      key={tab.value}
      onClick={() => handleTab(tab.value)}
      className={`px-6 py-2 cursor-pointer rounded-md transition-all duration-300 ease-in-out
        ${
          activeTab === tab.value
            ? "bg-green-600 text-white shadow-md scale-105"
            : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
        }`}
    >
      {tab.label}
    </div>
  ))}
</div>

<div
  className={`w-full border-b ${
    activeTab === "Landing-Village" ? "hidden" : "flex"
  }`}
>
  <div
    onClick={() => handleTabClick("data")}
    className="w-1/2 flex items-center justify-center h-12 bg-gray-50 text-lg font-medium text-gray-700 border-r cursor-pointer transition-all duration-300 hover:bg-green-100 hover:text-green-700"
  >
    Data
  </div>
  <div
    onClick={() => handleTabClick("graphs")}
    className="w-1/2 flex items-center justify-center h-12 bg-gray-50 text-lg font-medium text-gray-700 cursor-pointer transition-all duration-300 hover:bg-green-100 hover:text-green-700"
  >
    Visualization
  </div>
</div>


                {
                  activeTab === "Landing-Village" ?
                    <DataTable2 filters={vf} loading={loading} setLoading={setLoading} /> :
                    <>

                      <>
                        {
                          data && tag == "data" ?
                            <>
                              <div className="flex items-center justify-between w-full p-6 bg-gray-50 shadow">
                                <h1 className="text-xl font-bold text-gray-800">Your Data</h1>
                                <div className="flex gap-4">
                                  {[
                                    {
                                      onClick: () => downloadExcelWithCharts("xlsx"),
                                      icon: "fa-file-excel",
                                      bg: "bg-green-600",
                                      hoverBg: "hover:bg-green-700",
                                    },
                                    {
                                      onClick: () => downloadExcelWithCharts("csv"),
                                      icon: "fa-file-csv",
                                      bg: "bg-green-500",
                                      hoverBg: "hover:bg-green-600",
                                    },
                                    {
                                      onClick: openNameModel,
                                      icon: "fa-floppy-disk",
                                      bg: "bg-blue-500",
                                      hoverBg: "hover:bg-blue-600",
                                    },
                                    {
                                      onClick: shareToCommunity,
                                      icon: "fa-share",
                                      bg: "bg-purple-600",
                                      hoverBg: "hover:bg-purple-700",
                                    },
                                    {
                                      onClick: emailModel,
                                      icon: "fa-envelope",
                                      bg: "bg-red-600",
                                      hoverBg: "hover:bg-red-700",
                                    },
                                  ].map(({ onClick, icon, bg, hoverBg }, idx) => (
                                    <button
                                      key={idx}
                                      onClick={onClick}
                                      className={`flex items-center justify-center w-12 h-12 ${bg} text-white rounded-full shadow-lg ${hoverBg} transition-transform transform hover:scale-105`}
                                    >
                                      <i className={`fa-solid ${icon} text-xl`}></i>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* <div
                          className={`grid grid-cols-${lengthm} gap-4 p-4 border-t bg-gray-50`}
                        >
                          {filteredHeaders.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-center font-semibold text-sm uppercase bg-gray-200 p-2 border rounded shadow-sm"
                            >
                              {item.header}
                            </div>
                          ))}
                        </div> */}

                              {/* Render Data Rows */}
                              {<table className="min-w-full border-collapse border border-gray-200">
                                {/* Render Headers */}
                                <thead>
                                  <tr>
                                    {filteredHeaders.map((item, idx) => (
                                      <th
                                        key={idx}
                                        className="border border-gray-300 bg-gray-200 text-center font-semibold text-sm uppercase p-2"
                                      >
                                        {item.header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                {/* Render Data Rows */}
                                <tbody>
                                  {data &&
                                    data.map((item, index) => (
                                      <tr
                                        key={index}
                                        className={item["dataType"]  == "PFZ/NON-PFZ"? "bg-green-300" : "bg-red-300"}
                                      >
                                        {filteredHeaders.map((field, idx) => (
                                          <td
                                            key={idx}
                                            className="border border-gray-300 text-center text-gray-700 font-medium p-2"
                                          >
                                            {field.key === "date"
                                              ? new Date(item[field.key]).toLocaleDateString()
                                              : field.key === "latitude" || field.key === "longitude"
                                                ? truncateDecimals(item[field.key], 2)
                                                : field.key === "species" ? (
                                                  <i
                                                    onClick={() => openModal2(item)}
                                                    className="fa-solid fa-eye text-xl cursor-pointer hover:text-blue-500"
                                                  ></i>
                                                ) : (
                                                  item[field.key]
                                                )}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                              }
                            </> : data && tag == "graphs" && <FishCatchGraphs data={data} fileLoader={fileLoader} setfileLoader={setfileLoader} />
                        }


                      </>

                    </>
                }

                {isModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-1/2 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Species Details</h2>
                        <button
                          className="text-gray-600 hover:text-gray-800"
                          onClick={closeModal}
                        >
                          ✖
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-2 px-4 border-b text-left font-medium">
                                Species Name
                              </th>
                              <th className="py-2 px-4 border-b text-left font-medium">
                                Catch Weight (kg)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {modalData.species.length == 1 ? modalData.species.map((species, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-t">{species.name}</td>
                                <td className="py-2 px-4 border-t">
                                  {modalData["total_weight"]}
                                </td>
                              </tr>
                            )) : modalData.species.map((species, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-t">{species.name}</td>
                                <td className="py-2 px-4 border-t">
                                  {species.catch_weight}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-6 text-right">
                        <button
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>


              <div className="w-[20%] p-4 flex flex-col h-auto shadow-lg bg-white rounded-md ">

                {data !== null && <FilterMap catchData={data} props={{ type: "markers", showButton: true }} />}


                {/* <MapboxVisualization
              catchData={data}
              props={{ type: "markers", showButton: true }} /> */}

                <div className="w-full h-fit ml-2 m-4 shadow-md bg-gradient-to-r from-gray-50 via-white to-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <h1 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-2">
                      Your Filters
                    </h1>
                  </div>
                  <div>
                    <ul className="list-none list-inside space-y-2">
                      {Object.entries(filters).map(([key, value], index) => {
                        if (value) {
                          return (
                            <li
                              key={index}
                              className="flex items-center text-sm text-gray-700 gap-2"
                            >
                              <span className="font-medium text-gray-600 capitalize">{key}:</span>
                              <span className="text-gray-800 bg-gray-100 px-2 py-1 rounded-md">
                                {value}
                              </span>
                            </li>
                          );
                        }
                        return null;
                      })}
                    </ul>
                  </div>
                </div>


              </div>
            </div>

          </>
      }

      <>
        <Modal
          className="p-4"
          show={openModal}
          onClose={() => setOpenModal(false)}
        >
          <Modal.Header>Apply Your Filters</Modal.Header>
          <Modal.Body>
            {/* Input Fields */}
            {/* Checkbox Filters */}
            {
              activeTab === "Landing-Village" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { label: "From Date", name: "from", type: "date" },
                      { label: "To date", name: "to", type: "date" },
                      { label: "Latitude", name: "latitude", type: "number" },
                      { label: "Longitude", name: "longitude", type: "number" },
                      { label: "Village", name: "village", type: "text" },
                    ].map(({ label, name, type }, index) => (
                      <div key={index} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">{label}</label>
                        <input
                          type={type}
                          name={name}
                          value={filters2[name]}
                          onChange={handleFilterChange}
                          className="mt-1 p-2 shadow-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-4 mb-6">
                    <button onClick={handleMap} className="flex items-center p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300">
                      <i className="fa-solid p-2 rounded-full bg-blue-500 text-red-500 fa-map-pin"></i>
                      <span className="ml-2">GET CO-ORDINATES</span>
                    </button>

                    {[
                      { label: "Abundance", type: "majorDataType", value: "abundance" },
                      { label: "Occurrence", type: "majorDataType", value: "occurrence" },
                      { label: "PFZ", type: "zoneType", value: "PFZ" },
                      { label: "NON-PFZ", type: "zoneType", value: "NON-PFZ" },
                    ].map(({ label, type, value }) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters[type] === value}
                          onChange={() => handleCheckboxChange(type, value)}
                          className="accent-blue-600"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { label: "Latitude", name: "lat", type: "number" },
                      { label: "Longitude", name: "long", type: "number" },
                      { label: "Radius (km)", name: "radius", type: "number" },
                      { label: "Species Name", name: "speciesName", type: "text" },
                      { label: "Depth Min", name: "depthMin", type: "number" },
                      { label: "Depth Max", name: "depthMax", type: "number" },
                      { label: "From Date", name: "from", type: "date" },
                      { label: "To Date", name: "to", type: "date" },
                      { label: "Sea", name: "sea", type: "text" },
                      { label: "State", name: "state", type: "text" },
                      { label: "Wt. Min (kg)", name: "totalWeightMin", type: "number" },
                      { label: "Wt. Max (kg)", name: "totalWeightMax", type: "number" },
                      { label: "Region", name: "region", type: "text" },
                      ...(activeTab === "ALL" || activeTab === "GEO-REF"
                        ? [
                          { label: "LANDINGNAME", name: "LANDINGNAME", type: "text" },
                          { label: "Gear Type", name: "gearType", type: "dropdown" },
                        ]
                        : []),
                    ].map(({ label, name, type }, index) => (
                      <div key={index} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">{label}</label>
                        {type === "dropdown" ? (
                          <select
                            name={name}
                            value={filters[name]}
                            onChange={handleChange}
                            className="mt-1 p-2 shadow-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          >
                            <option value="">Select</option>
                            <option value="Hook and Line">Hook and Line</option>
                            <option value="Gill Net">Gill Net</option>
                            <option value="Bottom Trawling">Bottom Trawling</option>
                            <option value="Ring Net">Ring Net</option>
                            <option value="Trawler">Trawler</option>
                            <option value="Seine nets">Seine nets</option>
                            <option value="Fyke nets">Fyke nets</option>
                          </select>
                        ) : (
                          <input
                            type={type}
                            name={name}
                            value={filters[name]}
                            onChange={handleChange}
                            className="mt-1 p-2 shadow-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )
            }

            {/* Submit Button */}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={submit} disabled={loading}>
              {loading ? "Loading..." : "Apply Filters"}
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
        <ConfirmationModal
          msg={msg}
          isOpen={isModalOpen3}
          onClose={handleModalClose}
          onConfirm={onConfirm}
        />

        <Modal
          show={openModalc}
          onClose={() => setOpenModalc(false)}
          className="bg-gray-900 text-white"
        >
          {/* Modal Header */}
          <Modal.Header className="bg-gray-800 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-green-500">
              Select a Community
            </h2>
          </Modal.Header>

          {/* Modal Body */}
          <Modal.Body className="bg-gray-900">
            <div className="space-y-6">
              {/* Title */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-300">
                  Please select the community you want to interact with.
                </h3>
              </div>

              {/* Community List */}
              <div className="max-h-60 overflow-y-auto space-y-4">
                {communities.map((community, index) => (
                  <div
                    key={index}
                    onClick={() => sendDataForCommunity(community._id)}
                    className="flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer shadow-md transition duration-300"
                  >
                    <span className="text-lg font-medium">
                      {community.name}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </Modal.Body>

          {/* Modal Footer */}
          <Modal.Footer className="bg-gray-800 border-t border-gray-700">
            <Button
              color="gray"
              onClick={() => setOpenModalc(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Decline
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={openModale}
          onClose={() => setOpenModale(false)}
          className="bg-gray-900 text-white"
        >
          {/* Modal Header */}
          <Modal.Header className="bg-gray-800 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-green-500">Enter Emails</h2>
          </Modal.Header>

          {/* Modal Body */}
          <Modal.Body className="bg-gray-900">
            <textarea
              rows="5"
              placeholder="Enter emails separated by commas or new lines"
              onChange={handleEmailChange}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none"
            ></textarea>
          </Modal.Body>

          {/* Modal Footer */}
          <Modal.Footer className="bg-gray-800 border-t border-gray-700">
            <Button
              color="gray"
              onClick={downloadExcelWithCharts2}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Submit
            </Button>
            <Button
              color="gray"
              onClick={() => setOpenModale(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={openModaln}
          onClose={() => setOpenModaln(false)}
          className="bg-gray-900 text-white"
        >
          {/* Modal Header */}
          <Modal.Header className="bg-gray-800 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-green-500">Enter Name</h2>
          </Modal.Header>

          {/* Modal Body */}
          <Modal.Body className="bg-gray-900">
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={handlenameChange}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none"
            />
          </Modal.Body>

          {/* Modal Footer */}
          <Modal.Footer className="bg-gray-800 border-t border-gray-700">
            <Button
              onClick={handleSaveData}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Submit
            </Button>
            <Button
              onClick={() => setOpenModaln(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={isModalOpen4}
          onClose={() => setIsModalOpen4(false)}
          className="bg-gray-900 text-white"
        >
          {/* Modal Header */}
          <Modal.Header className="bg-gray-800 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-green-500">Enter Co-ordinates</h2>
          </Modal.Header>

          {/* Modal Body */}
          <Modal.Body className="bg-gray-900">
            <MapComponent setFilters={setFilters} />

          </Modal.Body>

          {/* Modal Footer */}
          <Modal.Footer className="bg-gray-800 border-t border-gray-700">
            <Button
              onClick={() => setIsModalOpen4(false)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Submit
            </Button>
            <Button
              onClick={() => setIsModalOpen4(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Decline
            </Button>
          </Modal.Footer>
        </Modal>

      </>
    </div>
  );
};

export default FilterForm;
