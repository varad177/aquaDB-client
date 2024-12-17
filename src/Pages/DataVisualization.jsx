import React, { useState, useEffect } from "react";

const ScientistCharts = () => {
  const [iframeSrc, setIframeSrc] = useState(
    "https://charts.mongodb.com/charts-sneha-lqltzmn/public/dashboards/ccf47374-f531-4d96-8188-99168ef9197e"
  );
  const [status, setStatus] = useState("Checking for updates...");
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [timeAgo, setTimeAgo] = useState(0);

  // const refreshDashboard = () => {
  //   setStatus("Refreshing dashboard...");
  //   setIframeSrc("");
  //   setTimeout(() => {
  //     setIframeSrc(
  //       "https://charts.mongodb.com/charts-sneha-lqltzmn/public/dashboards/ccf47374-f531-4d96-8188-99168ef9197e"
  //     );
  //     setStatus("Dashboard updated!");
  //   }, 1000);
  // };
  const refreshDashboard = () => {
    setStatus("Refreshing dashboard...");
    setIframeSrc("");
    setTimeout(() => {
      setIframeSrc(
        "https://charts.mongodb.com/charts-sneha-lqltzmn/public/dashboards/ccf47374-f531-4d96-8188-99168ef9197e"
      );
      setStatus("Dashboard updated!");
      setLastUpdated(Date.now()); // Update the last updated time
    }, 1000);
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refreshDashboard();
  //   }, 15000);
  //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(Math.floor((Date.now() - lastUpdated) / 1000)); // Calculate elapsed time in seconds
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [lastUpdated]); // Only run this effect when lastUpdated changes

  // Auto-refresh the dashboard every 10 minutes (600,000 ms)
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      refreshDashboard(); // Trigger a refresh of the dashboard
    }, 120000); // 10 minutes in milliseconds
    return () => clearInterval(autoRefreshInterval); // Cleanup on unmount
  }, []); // Only run this effect once (on mount)

  const formatTimeAgo = () => {
    const minutes = Math.floor(timeAgo / 60);
    const seconds = timeAgo % 60;
    return minutes > 0
      ? `${minutes} minute${minutes > 1 ? "s" : ""} ${seconds} second${
          seconds !== 1 ? "s" : ""
        } ago`
      : `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-white text-center py-4">
        <h1 className="text-3xl font-bold">Data Insights Visualization</h1>
        <p className="text-sm">
          {status} Last Updated {formatTimeAgo()}
        </p>
      </header>

      {/* Fullscreen Dashboard */}
      <div className="flex-grow">
        <iframe
          title="MongoDB Dashboard"
          src={iframeSrc}
          className="w-full h-full bg-purple- border-none"
        />
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-2">
        <button
          onClick={refreshDashboard}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium shadow-md"
        >
          Refresh Dashboard
        </button>
      </footer>
    </div>
  );
};

export default ScientistCharts;
