import React from "react";
import { Bar, Pie, Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const FishSpeciesCharts = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available to display charts.</p>;
  }

  // Prepare species data
  const speciesTotals = {};
  const dateLabels = [];

  data.forEach((entry) => {
    const date = new Date(entry.date).toLocaleDateString(); // Format date
    dateLabels.push(date);

    Object.entries(entry.species).forEach(([speciesName, quantity]) => {
      if (!speciesTotals[speciesName]) {
        speciesTotals[speciesName] = { total: 0, dailyData: [] };
      }
      speciesTotals[speciesName].total += quantity;
      speciesTotals[speciesName].dailyData.push(quantity);
    });
  });

  // Sort and filter species by total quantity
  const sortedSpecies = Object.entries(speciesTotals)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5); // Get top 5 species

  const labels = sortedSpecies.map(([name]) => name);
  const values = sortedSpecies.map(([, { total }]) => total);

  // Bar chart configuration for top species
  const barChartData = {
    labels,
    datasets: [
      {
        label: "Top Species Quantity (kg)",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Light blue
        borderColor: "rgba(54, 162, 235, 1)", // Dark blue
        borderWidth: 1,
      },
    ],
  };

  // Pie chart configuration for major species
  const pieChartData = {
    labels,
    datasets: [
      {
        label: "Major Species Distribution",
        data: values,
        backgroundColor: labels.map(
          (_, i) => `hsl(${(i / labels.length) * 360},70%,60%)`
        ), // Vibrant colors
        hoverOffset: 4,
      },
    ],
  };

  // Line chart configuration (aggregated trends)
  const lineChartData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Total Fish Quantity Over Time",
        data: dateLabels.map((date) =>
          Object.values(speciesTotals).reduce(
            (sum, { dailyData }) =>
              sum + (dailyData[dateLabels.indexOf(date)] || 0),
            0
          )
        ),
        fill: false,
        borderColor: "rgba(255,99,132,1)", // Pink
        tension: 0.1,
      },
    ],
  };

  // Radar chart configuration for overall species comparison
  const radarChartData = {
    labels,
    datasets: [
      {
        label: "Species Comparison",
        data: values,
        backgroundColor: "rgba(255,206,86,0.6)", // Light yellow
        borderColor: "rgba(255,206,86,1)", // Dark yellow
        borderWidth: 2,
      },
    ],
  };

  // Function to download charts as PDF
  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const chartsContainer = document.getElementById("charts-container");
    const charts = chartsContainer.getElementsByClassName("chart-card");

    for (let i = 0; i < charts.length; i++) {
      const canvas = await html2canvas(charts[i], { scale: 2 }); // Increase scale for better quality
      const imgData = canvas.toDataURL("image/png");

      // Calculate position based on the number of charts and set fixed height for each chart
      const imgHeight =
        (pdf.internal.pageSize.width * canvas.height) / canvas.width; // Maintain aspect ratio
      pdf.addImage(
        imgData,
        "PNG",
        10,
        (pdf.internal.pageSize.height / charts.length) * i + 10,
        pdf.internal.pageSize.width - 20,
        imgHeight
      );

      if (i < charts.length - 1) {
        pdf.addPage();
      }
    }

    pdf.save("fish_species_charts.pdf");
  };

  return (
    <div className="charts">
      <h1>Fish Species Data Visualization</h1>

      {/* Download Button */}
      <button
        onClick={downloadPDF}
        style={{
          marginBottom: "20px",
          padding: "10px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4CAF50", // Green background color
          color: "white", // White text color
          border: "none", // No border
          borderRadius: "5px", // Rounded corners
          transition: "background-color .3s", // Smooth transition for hover effect
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45a049")} // Darker green on hover
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")} // Original green on mouse out
      >
        Download Charts as PDF
      </button>

      <div id="charts-container" className="chart-container">
        <div className="chart-card">
          <h2>Top Species Bar Chart</h2>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>

        <div className="chart-card">
          <h2>Major Species Pie Chart</h2>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>

        <div className="chart-card">
          <h2>Total Fish Quantity Over Time</h2>
          <Line data={lineChartData} options={{ responsive: true }} />
        </div>

        <div className="chart-card">
          <h2>Species Comparison Radar Chart</h2>
          <Radar data={radarChartData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Add some basic styles */}
      <style jsx>{`
        .charts {
          text-align: center;
          padding: 20px;
        }
        .chart-container {
          display: grid;
          grid-template-columns: repeat(2, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .chart-card {
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
          padding: 20px;
          transition: transform 0.3s;
        }
        .chart-card:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default FishSpeciesCharts;
