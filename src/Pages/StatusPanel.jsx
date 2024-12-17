

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHourglassStart, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Loader from "../Components/Loader";
const StatusPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = localStorage.getItem("aquaUser");

  // Retrieve userId from localStorage if user exists
  let userId = null;
  if (user) {
    const parsedUser = JSON.parse(user);
    userId = parsedUser.userId; // Access the userId property
    console.log("userId",userId);
  } else {
    console.log("No user found in localStorage");
  }

  // Fetch user logs when the component mounts
  useEffect(() => {
    const fetchUserLogs = async () => {
      if (!userId) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `https://aquadb-server.onrender.com/user/getUserLogs`,
          { params: { userId } }
        );
        console.log(response);
      
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch logs");
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserLogs();
    }
  }, [userId]);

  // Sort logs by status (pending, accepted, rejected)
  const sortedLogs = logs.sort((a, b) => {
    const statusOrder = { pending: 1, accepted: 2, rejected: 3 };
    return statusOrder[a.dataStatus] - statusOrder[b.dataStatus];
  });

  // Function to determine icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaHourglassStart className="text-yellow-500" />;
      case "accepted":
        return <FaCheckCircle className="text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[95%] h-[85%] bg-white mx-auto mt-14 border-2 border-gray-300 rounded-md">
    <div className="p-6 space-y-6 bg-white">
      {loading && <Loader/>}
      {error && <div className="text-red-500 text-4xl text-semibold text-center  ">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          {sortedLogs.slice(0, Math.ceil(sortedLogs.length / 2)).map((log) => (
            <div
              key={log.dataId}
              className="flex items-center p-4 bg-white border-2 border-gray-300 rounded-xl shadow-md space-x-4 hover:bg-gray-50 transition duration-300 ease-in-out mb-4"
            >
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  <h3 className="text-lg font-semibold">Data Id</h3>

                  {log.dataId}
                </h3>
                <p className="text-sm text-gray-500">
                  Uploaded on: {new Date(log.uploadedAt).toLocaleDateString()}{" "}
                  at {new Date(log.uploadedAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex flex-col items-center space-x-2 space-y-2">
              <h3 className="text-lg font-semibold">Status</h3>
              <span
                  className={`font-semibold p-2 w-[150px] text-center border-4 border-dotted  rounded-md flex justify-center items-center gap-2 ${
                    log.dataStatus === "pending"
                      ? "text-yellow-500 border-yellow-300 bg-yellow-100"
                      : log.dataStatus === "accepted"
                      ? "text-green-500 border-green-300 bg-green-100"
                      : "text-red-500 border-red-300 bg-red-100"
                  }`}
                >
                  {getStatusIcon(log.dataStatus)}
                  {log.dataStatus}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div>
          {sortedLogs.slice(Math.ceil(sortedLogs.length / 2)).map((log) => (
            <div
              key={log.dataId}
              className="flex items-center p-4 bg-white border border-gray-300 rounded-xl shadow-md space-x-4 hover:bg-gray-50 transition duration-300 ease-in-out"
            >
              <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                  <h3 className="text-lg font-semibold">Data Id</h3>

                  {log.dataId}
                </h3>
                <p className="text-sm text-gray-500">
                  Uploaded on: {new Date(log.uploadedAt).toLocaleDateString()}{" "}
                  at {new Date(log.uploadedAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex flex-col items-center space-x-2 space-y-2">
              <h3 className="text-lg font-semibold ">Status</h3>
                <span
                  className={`font-semibold p-2 w-[150px] text-center border-4 border-dotted  rounded-md flex justify-center items-center gap-2 ${
                    log.dataStatus === "pending"
                      ? "text-yellow-500 border-yellow-300 bg-yellow-100"
                      : log.dataStatus === "accepted"
                      ? "text-green-500 border-green-300 bg-green-100"
                      : "text-red-500 border-red-300 bg-red-100"
                  }`}
                >
                  {getStatusIcon(log.dataStatus)}
                  {log.dataStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default StatusPanel;
