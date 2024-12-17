import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Button } from "flowbite-react";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://aquadb-server.onrender.com/admin/get-latest-logs")
      .then((response) => {
        console.log("get-latest-logs", response);

        setLogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
        setLoading(false);
      });
  }, []);

  const handleNavigate = (id, dataId) => {
    navigate(`/admin/unverify-fish-data/${id}/${dataId}`);
  };

  const getFileType = (fileType) => {
    console.log(fileType);
    if (fileType.includes("spreadsheetml.sheet")) {
      return "Excel";
    } else if (fileType.includes("csv")) {
      return "CSV";
    }
    return "Unknown";
  };

  return (
    <div className="container mx-auto my-1 rounded-lg shadow-lg bg-white">
      {/* <h2 className="text-xl font-bold text-blue-900 mb-6 text-center">
        Recent abundance/occurrence Uploads
      </h2> */}

      {loading ? (
        <div className="text-center text-lg text-blue-600">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border-b border">
            <thead>
              <tr className="bg-blue-300">
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-800 border-b">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-800 border-b">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-blue-800 border-b">
                  File Type
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-blue-800 border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 10).map((log) => (
                <tr key={log.userId} className="transition-all">
                  <td className="px-6 py-4 text-sm text-gray-800 border-b">
                    {log.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 border-b">
                    {dayjs(log.uploadTimestamp).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 border-b">
                    {getFileType(log.fileType)}
                  </td>
                  <td className="px-6 py-4 text-sm text-center border-b">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                      onClick={() => handleNavigate(log.userId, log.dataId)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Button
        className="mt-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 m-2 rounded-md shadow-lg hover:from-blue-700 hover:to-blue-950 hover:shadow-xl transition-all"
        onClick={() => navigate("/admin/get-data-upload-user")}
      >
        See All Users
      </Button>
    </div>
  );
};

export default Logs;
