import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const Dashboard2 = () => {
  // Sample data (replace with API data)
  const data = [
    {
      date: "2008-03-04T18:30:00.000Z",
      latitude: 22.0061527778,
      longitude: 67.8522222222,
      species: [{ name: "ribbonfish", catch_weight: null }, { name: "cuttlefish", catch_weight: null }],
      sea: "Arabian Sea",
      state: "Gujarat",
      total_weight: 12140,
    },
    {
      date: "2009-03-06T18:30:00.000Z",
      latitude: 17.455555555555556,
      longitude: 83.18777777777778,
      species: [{ name: "ponyfish", catch_weight: 50 }, { name: "lizardfish", catch_weight: 40 }],
      sea: "Bay of Bengal",
      state: "Odisha",
      total_weight: 390,
    },
    // More data...
  ];

  const [filteredData, setFilteredData] = useState(data);
  const [seaFilter, setSeaFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');

  // Handling Filter Changes
  const handleSeaFilter = (e) => {
    setSeaFilter(e.target.value);
  };

  const handleStateFilter = (e) => {
    setStateFilter(e.target.value);
  };

  // Filter data based on selected sea and state
  useEffect(() => {
    let filtered = data;
    if (seaFilter !== 'all') {
      filtered = filtered.filter(item => item.sea === seaFilter);
    }
    if (stateFilter !== 'all') {
      filtered = filtered.filter(item => item.state === stateFilter);
    }
    setFilteredData(filtered);
  }, [seaFilter, stateFilter]);

  // Chart Data Preparation
  const chartData = {
    labels: filteredData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Weight',
        data: filteredData.map(item => item.total_weight),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="container mx-auto p-5">
      <header className="mb-5 text-center">
        <h1 className="text-3xl font-bold">Fishing Dashboard</h1>
      </header>

      {/* Filters Section */}
      <div className="flex justify-between mb-5">
        <div>
          <label htmlFor="sea" className="mr-2">Sea:</label>
          <select id="sea" onChange={handleSeaFilter} className="border p-2 rounded">
            <option value="all">All</option>
            <option value="Arabian Sea">Arabian Sea</option>
            <option value="Bay of Bengal">Bay of Bengal</option>
            {/* Add more seas if needed */}
          </select>
        </div>

        <div>
          <label htmlFor="state" className="mr-2">State:</label>
          <select id="state" onChange={handleStateFilter} className="border p-2 rounded">
            <option value="all">All</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Odisha">Odisha</option>
            {/* Add more states if needed */}
          </select>
        </div>
      </div>

      {/* Total Records Section */}
      <div className="mb-5 text-lg font-semibold">
        <p>Total Records: {filteredData.length}</p>
        <p>Total Weight: {filteredData.reduce((acc, item) => acc + item.total_weight, 0)} grams</p>
      </div>

      {/* Line Chart Section */}
      <div className="mb-5">
        <h2 className="text-2xl font-semibold mb-3">Catch Weight Over Time</h2>
        <Line data={chartData} />
      </div>

      {/* Data Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Sea</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Total Weight</th>
              <th className="px-4 py-2">Species</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item._id} className="border-b">
                <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{item.sea}</td>
                <td className="px-4 py-2">{item.state}</td>
                <td className="px-4 py-2">{item.total_weight} grams</td>
                <td className="px-4 py-2">
                  {item.species.map(species => species.name).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard2;
