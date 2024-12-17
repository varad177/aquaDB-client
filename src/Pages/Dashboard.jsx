import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import  upload from "../assets/upload.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userInSession = localStorage.getItem("aquaUser");
    if (userInSession) {
      try {
        const { userType } = JSON.parse(userInSession);
        setUserRole(userType);
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  if (!userRole) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (
    !["research_cruises", "research_institute", "industry_collaborators", "admin"].includes(
      userRole
    )
  ) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-red-600">Error: Invalid user type</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen p-8 bg-white flex flex-col gap-8">
      {/* Header */}
      <header className="bg-[#ccb8ff] p-6 rounded-lg shadow-md flex justify-between items-center">
        <Typography variant="h4" className="font-bold text-gray-800">
          {userRole === "research_cruises" && <strong>Research Cruises Dashboard</strong>}
          {userRole === "research_institute" && <strong>Research Institute Dashboard</strong>}
          {userRole === "industry_collaborators" && <strong>Industry Collaborators Dashboard</strong>}
          {userRole === "admin" && <strong>Admin Panel</strong>}
        </Typography>
      </header>

      {/* Dashboard Main Content */}
      <div className="flex flex-col h-full gap-8">
        {/* Top Section: File Info and Profile */}
        <div className="h-1/2 flex gap-8">
          {/* File Info Section */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 w-3/5">
            <div className="row-span-2 bg-[#19073d] text-white rounded-lg p-6 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl ">Total Files Uploaded</h2>
              <p className="text-4xl font-bold p-5">100</p>
            </div>
            <div className="bg-yellow-400 text-white rounded-lg p-6 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl">Files Verified</h2>
              <p className="text-4xl font-bold p-5">50</p>
            </div>
            <div className="bg-blue-600 text-white rounded-lg p-6 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl">Pending Verification</h2>
              <p className="text-4xl font-bold p-5">50</p>
            </div>
          </div>

          {/* Enhanced Profile Section */}
          <div className="w-2/5 bg-white rounded-lg p-6 shadow-md flex flex-col justify-between">
            <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
              <strong>Your Profile</strong>
            </Typography>

            <div className="flex h-full items-center">
              {/* Profile Info */}
              <div className="w-1/2 pr-4">
                <p className="mb-4 text-lg"><strong>Full Name:</strong> John Doe</p>
                <p className="mb-4 text-lg"><strong>User Name:</strong> johndoe</p>
                <p className="mb-4 text-lg"><strong>Phone Number:</strong> +123456789</p>
                <p className="mb-4 text-lg"><strong>Email ID:</strong> john.doe@example.com</p>
                <p className="mb-4 text-lg"><strong>Bio:</strong> Enthusiastic researcher in marine studies.</p>
              </div>

              {/* Profile Image */}
              <div className="w-1/2 flex flex-col items-center justify-center">
                <div className="bg-purple-500 text-white w-24 h-24 rounded-full flex items-center justify-center shadow-md mb-4">
                  <i className="fa-solid fa-user text-3xl"></i>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Logs and Contribution */}
        <div className="h-1/2 flex gap-8">
          {/* User Logs */}
          <div className="flex-1 bg-gray-200 rounded-lg p-6 shadow-md shadow-lg transition">
            <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
              <strong>User Logs</strong>
            </Typography>
            <p className="text-gray-600">No recent logs available.</p>
          </div>

          {/* Contribute More */}
          <div className="w-1/4 bg-white border-3 border-blue-900 rounded-lg p-6 shadow-md flex flex-col items-center justify-center shadow-lg transition">
            <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
              <strong>Contribute More</strong>
            </Typography>
            <button className="bg-gray-900 text-white rounded-full shadow-md hover:bg-purple-700 transition">
            <div className="text-white w-20 h-20 rounded-full flex items-center justify-center shadow-md ">
          <img
                src={upload}  // Replace with your image path
                alt="upload_logo"
                className="w-24 h-24 bg-white"
            />
         </div>  
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
