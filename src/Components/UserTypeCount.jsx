import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";

const UserTypeCount = () => {
  const [userTypeData, setUserTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the user type data from the API
  useEffect(() => {
    const fetchUserTypeCount = async () => {
      try {
        const response = await axios.get(
          "https://aquadb-server.onrender.com/admin/get-userType-Count"
        );
        setUserTypeData(response.data);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTypeCount();
  }, []);

  return (
    <div>
        <Typography variant="h6" color="black">
            User type count
        </Typography>

      {loading ? (
        <div className="text-center text-blue-600 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 font-medium">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg mt-2">
          <table className="w-full table-auto rounded-lg border-collapse border-b border">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-white border-b">
                  User Type
                </th>
                <th className="px-6 py-3 text-left font-medium text-white border-b">
                  Total Users
                </th>
              </tr>
            </thead>
            <tbody>
            
                <tr className=" transition-all">
                  <td className="px-6 py-4 text-sm text-gray-700 border-b " >
                    <span className="bg-white p-1 rounded-lg" style={{border: "1.5px solid #909019", color: "#909019"}}>Research Cruisers</span>
                    
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {/* {item.totalUsers} */}
                    13
                  </td>
                </tr>
                <tr className=" transition-all">
                  <td className="px-6 py-4 text-sm text-gray-700 border-b " >
                    <span className="bg-white p-1 rounded-lg" style={{border: "1.5px solid #4cd926", color: "#4cd926"}}>Industry</span>
                    
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {/* {item.totalUsers} */}
                    11
                  </td>
                </tr>
                <tr className=" transition-all">
                  <td className="px-6 py-4 text-sm text-gray-700 border-b " >
                    <span className="bg-white p-1 rounded-lg" style={{border: "1.5px solid #7e3af2", color: "#7e3af2"}}>Collaborators</span>
                    
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {/* {item.totalUsers} */}
                    32
                  </td>
                </tr>
                <tr className=" transition-all">
                  <td className="px-6 py-4 text-sm text-gray-700 border-b " >
                    <span className="bg-white p-1 rounded-lg" style={{border: "1.5px solid #ff0000", color: "#ff0000"}}>Scientists</span>
                    
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {/* {item.totalUsers} */}
                    27
                  </td>
                </tr>
                <tr className=" transition-all">
                  <td className="px-6 py-4 text-sm text-gray-700 border-b " >
                    <span className="bg-white p-1 rounded-lg" style={{border: "1.5px solid #3f83f8", color: "#3f83f8"}}>Others</span>
                    
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b">
                    {/* {item.totalUsers} */}
                    4
                  </td>
                </tr>
              
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTypeCount;
