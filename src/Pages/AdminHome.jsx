import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AnimationWrapper from "./Animation-page";
import AdminUpperStrip from "../Components/AdminUpperStrip";
import UserTypeCount from "../Components/UserTypeCount";
import { Typography } from "@mui/material";
import axios from "axios";

const AdminHome = () => {
  const tables = {
    "PFZ/NON-PFZ": ["Date", "Status", "Data Id", "Username", "type"],
    "Landing-Village": ["Date", "Status", "Data Id", "Username", "type"],
    "GEO-REF": ["Date", "Status", "Data Id", "Username", "type"],
    "abundance/occurrence": ["Date", "Status", "Data Id", "Username", "type"]  };
  // const tables = {
  //   "PFZ/NON-PFZ": ["Date", "Status", "Data Id", "Username", "type"],
  //   "Landing-Village": ["Species name", "Date", "Catch (kg)", "Landing Name", "Gear type"],
  //   "GEO-REF": ["Latitude", "Longitude", "Species", "Depth", "Total Weight"],
  //   "abundance/occurrence": ["Date", "Latitude", "Longitude", "Depth", "Species", "Total Weight"]  };

  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("PFZ/NON-PFZ");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userTypes, setUsersType] = useState([]);

  const fetchLogsData = async (type) => {
    try {
      setLoading(true);
      const response = await axios.get("https://aquadb-server.onrender.com/admin/get-userType-Count");
      setUsersType(response.data|| []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUsersType = async (type) => {
    try {
      setLoading(true);
      const response = await axios.post("https://aquadb-server.onrender.com/admin/get-other-log", {
        dataType: type,
      });
      setTableData(response.data.logs || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("aquaUser");
    const userInSession = JSON.parse(user);
    if (!userInSession || userInSession.userType !== "admin") {
      toast.error("You cannot access this page");
      navigate("/signin");
      return;
    }
    fetchUsersType(selectedTab)
    fetchLogsData(selectedTab);
  }, [navigate, selectedTab]);

  const handleTabChange = (type) => {
    setSelectedTab(type);
  };

  const handleNavigate = (id, dataId, table) => {
    navigate(`/admin/unverify-fish-data/${id}/${dataId}`);
  };  

  const renderTable = () => {
    if (loading) {
      return (<div>Loading...</div>)
    }
    if (tableData.length === 0) {
      return (<div>No data available</div>)
    }
    return (
      <table className="w-full shadow-lg rounded-2xl">
        <thead>
          <tr className="bg-blue-400 text-white font-medium">
            {tables[selectedTab].map((header, index) => (
              <th key={index} className="p-2 text-md">
                {header}
              </th>
            ))}
            <th className="p-2 text-md">Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.slice(0, 5).map((item, index) => (
            <tr key={index} className="text-md text-gray-800 border-b bg-white text-center">
              <td className="px-6 py-2">{item.createdAt || "-"}</td>
              <td className="px-6 py-2">{item.dataStatus || "-"}</td>
              <td className="px-6 py-2">{item.dataId || "-"}</td>
              <td className="px-6 py-2">{item.userId.username || "-"}</td>
              <td className="px-6 py-2">{item.dataType || "-"}</td>
              <td className="px-6 py-2">
              <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  onClick={() => handleNavigate(item.userId._id, item.dataId, selectedTab)}
                >
                  <i className="fa-solid fa-eye"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <AnimationWrapper className="h-screen bg-blue-100 py-4 px-8">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <div className="mb-5">
        <AdminUpperStrip userTypes={userTypes} />
      </div>
      <div className="flex gap-8 justify-between">
        <div className="w-[70%]">
          <Typography variant="h6" gutterBottom>
            Logs Data
          </Typography>
          <ul className="flex flex-wrap justify-between text-md font-medium text-center text-gray-500 border-b border-gray-300">
            {Object.keys(tables).map((tab) => (
              <li key={tab}>
                <button
                  className={`inline-block p-4 rounded-t-lg ${
                    selectedTab === tab ? "bg-blue-300 text-blue-600" : ""
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
          {renderTable()}
        </div>
        <div className="w-[30%]">
          <UserTypeCount />
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default AdminHome;