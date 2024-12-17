import { useState, useEffect } from 'react';
import React from 'react';
import CustomCalendar from '../Components/CustomCalendar';
import Table from '../Components/Table';
import { Card, CardContent, Typography } from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
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

const Dashboard = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        getData()
      }, [])
    
    const getData = async () => {
    try {
        const response = await axios.post('https://aquadb-server.onrender.com/scientist/filter-data');
        setData(response.data);

    } catch (error) {
        console.error('Error fetching filtered data:', error);
    }
    }

    const calculateSpeciesStats = () => {
        const speciesMap = new Map();
        data.forEach((catchDetail) => {
            catchDetail.species.forEach((s) => {
              if (s.name && s.catch_weight) {
                speciesMap.set(
                  s.name,
                  (speciesMap.get(s.name) || 0) + s.catch_weight
                );
              }
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
    
      const { speciesCounts, mostCommonSpecies, averageWeight } = calculateSpeciesStats();
    
      const speciesNames = speciesCounts.map(([species]) => species);
      const speciesWeights = speciesCounts.map(([, weight]) => weight);
    
      const barData = {
        labels: speciesNames,
        datasets: [
          {
            label: "Species Distribution",
            data: speciesWeights,
            backgroundColor: "#8b5cf6",
            borderColor: "#8b5cf6",
            borderWidth: 1,
          },
        ],
      };

      const lineData = {
        labels: speciesNames,
        datasets: [
          {
            label: "Catch Weight vs Species",
            data: speciesWeights,
            borderColor: "#8b5cf6",
            backgroundColor: "#8b5cf6",
            fill: true,
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
                "#a78bfa", // Lighter variant
                "#6d37d7", // Darker variant
                "#7c3aed", // More saturated variant
                "#9e8bfa", // Muted variant
                "#8b72f6", // Hue-shifted variant
                "#b692fc", // Softer, pastel-like variant
                "#8057e5", // Slightly muted, darker tone
                "#9674f8", // Slightly warmer tone
                "#7b4bf4", // Rich, deep purple
                "#9a7df7", // Balanced purple tone
                "#d8b4fe", // Much lighter, pastel purple
                "#ebe4ff", // Very pale, almost white purple
                "#5a27b4", // Much darker, deep violet
                "#471f8c", // Very dark, rich purple
                "#c4a5fd", // Subtle, lighter lavender
                "#320d6d", // Extremely dark purple
                "#f3e8ff", // Extremely light lavender
                "#220852", // Deep and moody purple
                "#ccb8ff", // Light, delicate purple
                "#19073d", // Ultra-dark violet
            ],
          },
        ],
      };
    return (
    
        <div className="flex-1 p-5 bg-white rounded-2xl">
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <div className="flex gap-8 justify-between">
                {/* Left Section */}
                <div className="w-[70%]">
                    {/* Some Visuals */}
                    <div className="grid grid-cols-[40%_60%] gap-5">
                        <div className="rounded-xl p-3 border border-lg border-purple-200">
                                    <Typography variant="h6" color="textSecondary">
                                        Species Weight Distribution
                                    </Typography>
                                    <Line data={lineData} />
                        </div>

                        <div className="rounded-xl p-3 border border-lg border-purple-500 row-span-2">
                        
                            <div className='h-full w-full'>
                            
                                <Typography variant="h6" color="textSecondary">
                                    Species Weight Distribution
                                </Typography>
                                <div style={{ height: '450px' }}>
                                    <Pie data={pieData} 
                                    options={ {
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                              labels: {
                                                font: {
                                                  size: 10, // Reduce font size
                                                },
                                              },
                                              position: 'right'
                                            },
                                            tooltip: {
                                              bodyFont: {
                                                size: 1, // Adjust tooltip font size
                                              },
                                            },
                                          },
                                        }}
                                       />
                                        </div>
                            </div>
                        </div>

                        <div className="rounded-xl p-3 border border-lg border-purple-500" >
                            
                            
                                <Typography variant="h6" color="textSecondary">
                                    Species Weight Distribution
                                </Typography>
                                <Bar data={barData} />
                        
                        </div>
                    </div>

                    <section className="my-5">
                        <h3 className="font-semibold ml-6">Today's Tasks</h3>
                        <Table />
                    </section>

                    {/* Some Details */}
                    <div className="grid grid-cols-5 gap-5 my-4">
                        <div className="rounded-xl p-3 border border-lg h-[10rem] border-purple-200 col-span-2"></div>
                        <div className="rounded-xl p-3 border border-lg h-[10rem] border-purple-500"></div>
                        <div className="rounded-xl p-3 border border-lg h-[10rem] border-purple-500"></div>
                        <div className="rounded-xl p-3 border border-lg h-[10rem] border-purple-200"></div>
                    </div>


                    <div className="grid grid-cols-3 gap-5 my-4">
                        <div className="rounded-xl p-3 border border-lg h-[10rem] border-purple-200 col-span-2"></div>
                        <div className="rounded-xl p-3 border border-lg h-[10rem] border-purple-500"></div>
                    </div>

                    
                </div>
                {/* Right Section */}
                <div className="w-[30%] flex flex-col gap-5 ml-3">
                    
                    {/* <div><CustomCalendar /></div> */}
                    <div className="rounded-xl p-3 border border-lg border-purple-200">
                            <Typography variant="h6" color="textPrimary">
                                Revenue Reports
                            </Typography>

                            <div className="grid grid-rows-2 gap-5 mt-6">    
                                <div className="rounded-xl bg-[#F3F6FD] h-[10rem] p-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <h1 className='font-bold text-black text-xl'>10000</h1>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quia.</p>
                                    </div>

                                    <div class="relative w-[7rem] h-[7rem] mt-3">
                                    
                                        <div class="absolute inset-0 rounded-full border-8 border-gray-300"></div>
                                        
                                        <div
                                            class="absolute inset-0 rounded-full border-8 border-purple-500"
                                            style={{clipPath: "inset(0 calc(50% - 2px) 0 0)", transform: "rotate(-160deg)"}}
                                        ></div>
                                        
                                        <div class="absolute inset-0 flex items-center justify-center text-sm font-bold">
                                            50%
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl bg-[#F3F6FD] h-[10rem] p-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <h1 className='font-bold text-black text-xl'>10000</h1>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quia.</p>
                                    </div>

                                    <div class="relative w-[7rem] h-[7rem] mt-3">
                                    
                                        <div class="absolute inset-0 rounded-full border-8 border-gray-300"></div>
                                        
                                        <div
                                            class="absolute inset-0 rounded-full border-8 border-purple-500"
                                            style={{clipPath: "inset(0 calc(50% - 2px) 0 0)", transform: "rotate(-160deg)"}}
                                        ></div>
                                        
                                        <div class="absolute inset-0 flex items-center justify-center text-sm font-bold">
                                            50%
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>

                    <div className="rounded-xl p-3 border border-lg border-purple-200">
                        <div className="flex-1 p-5 bg-white rounded-xl text-center text-lg text-blue-900">
                             Open Projects <strong>500</strong>
                         </div>
                    </div>
                    <div className="rounded-xl p-3 border border-lg border-purple-200">
                        <div className="flex-1 p-5 bg-white rounded-xl text-center text-lg text-blue-900">
                            Successfully Completed <strong>3502</strong>
                        </div>
                    </div>
                    <div className="rounded-xl p-3 border border-lg border-purple-200">
                        <div className="flex-1 p-5 bg-white rounded-xl text-center text-lg text-blue-900">
                            Earned this month <strong>$15000</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


// import React from 'react';
// import CustomCalendar from '../Components/CustomCalendar';
// import Table from '../Components/Table';

// const Dashboard = () => {
//     return (
//         <div className="flex-1 p-5 bg-[#F4F7FC] rounded-2xl h-full">
//             <div className="flex gap-8 justify-between">
//                 {/* Left Section */}
//                 <div className="w-[70%]">
//                     {/* Dashboard Header */}
//                     <header className="flex gap-8 items-center mb-5">
//                         <h1 className="text-xl font-semibold">Dashboard</h1>
//                         <input
//                             type="text"
//                             placeholder="Search"
//                             className="py-2 px-4 rounded-full border-0 shadow-sm w-1/2"
//                         />
//                     </header>

//                     {/* Greeting Section */}
//                     <section className="bg-[#0f123f] text-white px-6 py-8 rounded-xl mb-5">
//                         <div>
//                             <h2 className="text-lg font-light">Good Morning, Farhaan</h2>
//                             <p className="text-3xl font-semibold">Check your daily tasks & schedules</p>
//                         </div>
//                     </section>

//                     {/* Activities Section */}
//                     <section className="mb-5 p-6 bg-white rounded-xl shadow-md h-[18rem]">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="font-semibold text-lg">Activities</h3>
//                             <div className="flex gap-2">
//                                 <button className="py-1 px-3 rounded-md bg-blue-800 text-white">
//                                     This Month
//                                 </button>
//                                 <button className="py-1 px-3 rounded-md bg-blue-800 text-white">
//                                     This Week
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="flex items-center justify-center text-blue-800">
//                             Graph will go here
//                         </div>
//                     </section>

//                     {/* Today's Tasks Section */}
                    // <section className="mb-5">
                    //     <h3 className="font-semibold ml-6">Today's Tasks</h3>
                    //     <Table />
                    // </section>
//                 </div>

//                 {/* Right Section */}
//                 <div className="w-[30%]">
//                     <CustomCalendar />

//                     {/* Statistics Section */}
//                     <section className="mt-8 flex flex-col gap-5">
//                         <div className="flex-1 p-5 bg-white rounded-xl text-center text-lg text-blue-900 shadow-md">
//                             Open Projects <strong>500</strong>
//                         </div>
                        // <div className="flex-1 p-5 bg-white rounded-xl text-center text-lg text-blue-900 shadow-md">
                        //     Successfully Completed <strong>3502</strong>
                        // </div>
                        // <div className="flex-1 p-5 bg-white rounded-xl text-center text-lg text-blue-900 shadow-md">
                        //     Earned this month <strong>$15000</strong>
                        // </div>
//                     </section>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;