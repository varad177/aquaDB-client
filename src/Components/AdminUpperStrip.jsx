import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bubble, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, registerables, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, ...registerables);
import { Typography } from "@mui/material";

const AdminUpperStrip = ({userTypes}) => {
  const [speciesCount, setSpeciesCount] = useState(0); // To store the count
  const [loading, setLoading] = useState(true); // To control the loader visibility
  const [currentCount, setCurrentCount] = useState(0); // To animate the count

  useEffect(() => {
    fetchSpeciesCount();
  }, []);

  function convertUserDataToChartFormat(userData) {
    // Define the mapping of user types to chart labels
    const labelMapping = {
        "research_cruises": "Cruises",
        "industry-collaborators": "Industry",
        "research_institute": "Collaborators",
        "scientist": "Others"
    };

    // Initialize the data structure
    const data = {
        labels: [],
        datasets: [
            {
                label: `Bubble Chart`,
                data: [],
                backgroundColor: [
                    "#ccb8ff", // Light, delicate purple
                    "#a78bfa", // Lighter variant
                    "#8057e5", // Slightly muted, darker tone
                    "#19073d", // Ultra-dark violet
                    "#7b4bf4", // Rich, deep purple
                    "#d8b4fe", // Much lighter, pastel purple
                    "#5a27b4", // Much darker, deep violet
                    "#c4a5fd", // Subtle, lighter lavender
                    "#f3e8ff", // Extremely light lavender
                ],
            },
        ],
    };

    // Aggregate the total users by label
    const userCounts = {
        Cruises: 0,
        Industry: 0,
        Collaborators: 0,
        Others: 0,
    };

    userData.forEach(user => {
        const label = labelMapping[user.userType];
        if (label) {
            userCounts[label] += user.totalUsers;
        }
    });

    // Populate the labels and data arrays
    for (const [label, count] of Object.entries(userCounts)) {
        data.labels.push(label);
        data.datasets[0].data.push(count);
    }

    return data;
}

// Example usage:
const userData = [
    { "totalUsers": 1, "userType": "admin" },
    { "totalUsers": 3, "userType": "scientist" },
    { "totalUsers": 5, "userType": "research_institute" },
    { "totalUsers": 3, "userType": "research_cruises" },
    { "totalUsers": 11, "userType": "industry-collaborators" }
];

const chartData = convertUserDataToChartFormat(userData);


  const fetchSpeciesCount = async () => {
    try {
      const response = await axios.get(
        "https://aquadb-server.onrender.com/admin/get-unique-fish-count"
      );
      if (response.data.success) {
        setSpeciesCount(response.data.uniqueSpeciesCount); // Set the total species count
        setLoading(false); // Hide the loader after data comes
      }
    } catch (error) {
      console.error("Error fetching species count:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        if (currentCount < speciesCount) {
          setCurrentCount((prevCount) => prevCount + 1);
        } else {
          clearInterval(interval); // Stop once the count reaches the species count
        }
      }, 10); // Adjust speed of increment
      return () => clearInterval(interval);
    }
  }, [loading, speciesCount, currentCount]);

  // const data = {
  //   labels: ["Cruises", "Industry", "Collaborators", "Others"],
  //   datasets: [
  //     {
  //       label: `Bubble Chart`,
  //       data: [10, 20, 30, 40, 50],
  //       backgroundColor: [
  //         "#ccb8ff", // Light, delicate purple
  //         "#a78bfa", // Lighter variant
          
  //         "#8057e5", // Slightly muted, darker tone
          
  //         "#19073d", // Ultra-dark violet
  //         "#7b4bf4", // Rich, deep purple
  //         "#d8b4fe", // Much lighter, pastel purple
  //         "#5a27b4", // Much darker, deep violet
  //         "#c4a5fd", // Subtle, lighter lavender
  //         "#f3e8ff", // Extremely light lavender
  //       ],
  //     },
  //   ],
  // };

  const options = {
    plugins: {
      legend: {
        labels: {
          // Change the color of the labels
          
          font: {
            size: 16, // Optional: change font size
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Unique Species Box */}
      {/* <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg text-center">
        {loading ? (
          <div className="text-lg font-semibold text-gray-200">Loading...</div>
        ) : (
          <>
            <h3 className="text-xl font-semiboldmb-2">Total Unique Species</h3>
            <div className="text-4xl font-bold">{currentCount}</div>

          </>
        )}
      </div> */}

      <div className="bg-white text-black p-4 rounded-lg shadow-lg">
            <Typography variant="h5" color="textSecondary" style={{marginBottom: "1rem"}}>
              Total Contributions
            </Typography>
            {/* <div className="text-4xl font-bold">{currentCount}</div> */}
            <Pie data={chartData} options={options} />
      </div>

      {/* Dummy Box for System Health */}
      <div className="relative bg-[#ccb8ff] text-white p-4 rounded-lg shadow-lg">
            <Typography variant="h5" color="textPrimary">
              Total Records
            </Typography>
            <div className="h-[60%] w-[90%] mx-auto" style={{backgroundImage: "url(../../public/totalRecordsImage.png)", backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat"}}></div>
            <p className="absolute bottom-0 left-0 p-6 text-black font-medium text-3xl">450 in Central Repository</p>
      </div>


      {/* Dummy Box for New Datasets */}
      <div className="bg-purple-500 text-white p-4 rounded-lg shadow-lg">
        <Typography variant="h5" style={{marginBottom: "1rem"}}>
        Total Pending Updates
        </Typography>
        
        <div className="flex justify-between gap-4 w-full h-[50%] p-4" style={{rotate: "180deg"}}>
          <div className="bg-red-500 w-1/6 h-[30%]"></div>
          <div className="bg-blue-200 w-1/6 h-[70%]"></div>
          <div className="bg-yellow-300 w-1/6 h-[90%]"></div>
          <div className="bg-red-200 w-1/6 h-[35%]"></div>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className="bg-red-200 w-4 h-4 mr-3"></div>
            <p>Cruises  34</p>
          </div>
          <div className="flex items-center mb-2">
            <div className="bg-yellow-300 w-4 h-4 mr-3"></div>
            <p>Industry  45</p>
          </div>
          <div className="flex items-center mb-2">
            <div className="bg-blue-200 w-4 h-4 mr-3"></div>
            <p>Collaborators  89</p>
          </div>
          <div className="flex items-center mb-2">
            <div className="bg-red-500 w-4 h-4 mr-3"></div>
            <p>Others  34</p>
          </div>
        </div>
        {/* <Bubble data={data} options={options} /> */}
      </div>

      {/* Dummy Box for Active Users */}
      <div className="bg-[#19073d] text-white p-4 rounded-lg shadow-lg">
        <Typography variant="h5" color="white">
          Users Stats
        </Typography>
        <div className="h-[70%] w-[70%] mx-auto" style={{backgroundImage: "url(../../public/personImage.png)", backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat"}}></div>

          <div className="flex items-center mb-2 mx-auto flex justify-center">
            <div className="bg-green-600 w-8 h-4 mr-3 rounded-xl"></div>
            <p>Verified Users 5</p>
          </div>
          <div className="flex items-center mb-2 mx-auto flex justify-center">
            <div className="bg-red-600 w-8 h-4 mr-3 rounded-xl"></div>
            <p>Unverified Users 10</p>
          </div>

      </div>

      
    </div>
  );
};

export default AdminUpperStrip;
