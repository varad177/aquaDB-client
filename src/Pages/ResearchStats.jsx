import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ResearchStatsMap from "../Components/MapComponents/ResearchStats";

const ResearchStats = () => {
  const [catchData, setCatchData] = useState([]);
  let { id } = useParams();

  useEffect(() => {
    const fetchCatchData = async () => {
      try {
        const response = await axios.post(
          "https://aquadb-server.onrender.com/admin/get-fish-data",
          { userId: id }
        );
        setCatchData(response.data);
      } catch (error) {
        console.error("Error fetching catch data:", error);
      }
    };

    fetchCatchData();
  }, []);
  return (
    <div className="text-2xl text-center text-white">
      RESEARCH MAP
      {/* compinents mein check new map component */}
      <ResearchStatsMap catchData={catchData} />
    </div>
  );
};

export default ResearchStats;
