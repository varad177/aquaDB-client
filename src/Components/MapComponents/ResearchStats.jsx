import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
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

const ResearchStatsMap = ({ catchData }) => {
  // Helper functions for calculations
  const calculateTotalCatchWeight = () => {
    return catchData.reduce((total, data) => {
      const catchWeight = data.catches.reduce((subTotal, singleCatch) => {
        if (!singleCatch || !singleCatch.species) return subTotal;
        const speciesWeight = singleCatch.species.reduce(
          (speciesTotal, species) => speciesTotal + (species.catch_weight || 0),
          0
        );
        return subTotal + speciesWeight;
      }, 0);
      return total + catchWeight;
    }, 0);
  };

  const calculateDepthStats = () => {
    const allDepths = catchData.flatMap((data) =>
      data.catches.map((catchDetail) => catchDetail.depth || 0)
    );
    const minDepth = Math.min(...allDepths);
    const maxDepth = Math.max(...allDepths);
    const avgDepth = (
      allDepths.reduce((total, depth) => total + depth, 0) / allDepths.length
    ).toFixed(2);

    return { minDepth, maxDepth, avgDepth };
  };

  const calculateSpeciesStats = () => {
    const speciesMap = new Map();
    catchData.forEach((data) => {
      data.catches.forEach((catchDetail) => {
        catchDetail.species.forEach((s) => {
          if (s.name && s.catch_weight) {
            speciesMap.set(
              s.name,
              (speciesMap.get(s.name) || 0) + s.catch_weight
            );
          }
        });
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

  // Data for stats and charts
  const totalCatchWeight = calculateTotalCatchWeight();
  const { minDepth, maxDepth, avgDepth } = calculateDepthStats();
  const { speciesCounts, mostCommonSpecies, averageWeight } =
    calculateSpeciesStats();

  const speciesNames = speciesCounts.map(([species]) => species);
  const speciesWeights = speciesCounts.map(([, weight]) => weight);

  const barData = {
    labels: speciesNames,
    datasets: [
      {
        label: "Species Weight (kg)",
        data: speciesWeights,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: speciesNames,
    datasets: [
      {
        label: "Species Distribution",
        data: speciesWeights,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // Line chart data - replace Scatter with Line chart
  const lineData = {
    labels: speciesNames,
    datasets: [
      {
        label: "Catch Weight vs Species",
        data: speciesWeights,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Research Stats
      </Typography>
      <Grid container spacing={3}>
        {/* Stats */}
        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Total Catch Weight
              </Typography>
              <Typography variant="h4" color="primary">
                {totalCatchWeight} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Average Depth
              </Typography>
              <Typography variant="h4" color="primary">
                {avgDepth} meters
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Min: {minDepth}m, Max: {maxDepth}m
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Most Common Species
              </Typography>
              <Typography variant="h4" color="primary">
                {mostCommonSpecies[0]} ({mostCommonSpecies[1]} kg)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Species Distribution
              </Typography>
              <Pie data={pieData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Species Weight Distribution
              </Typography>
              <Bar data={barData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart*/}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" color="textSecondary">
                Catch Weight vs Species Trend
              </Typography>
              <Line data={lineData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResearchStatsMap;
