import React, { useState } from "react";

const DataDisplay = ({ data }) => {
  const [showResult, setShowResult] = useState(3);
  const limitData = data.slice(0, showResult);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const handleLoadMore = (type) => {
    if(type === "less") setShowResult(showResult - showResult + 3);
    else setShowResult(showResult + 4);
  }

  // Filter data based on the search term
  const filteredData = data.filter((item) => {
    return (
      item.species.some((species) =>
        species.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      item.sea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.latitude.toString().includes(searchTerm) ||
      item.longitude.toString().includes(searchTerm)
    );
  });

  // Paginate data
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredData.slice(indexOfFirstResult, indexOfLastResult);

  const totalPages = Math.ceil(filteredData.length / resultsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // console.log(limitData);
  return (
    <div className="px-4 bg-white">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by species, sea, state, or coordinates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300"
        />
      </div>

      {/* Summary Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="font-semibold text-sm">
          <span>Total Species: </span>
          <span className="text-blue-600">
            {currentResults.reduce((acc, item) => acc + item.species.length, 0)}
          </span>
        </div>
        <div className="font-semibold text-sm">
          <span>Average Depth: </span>
          <span className="text-blue-600">
            {(
              currentResults.reduce((acc, item) => acc + item.depth, 0) /
              currentResults.length
            ).toFixed(2)}{" "}
            m
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-auto border border-gray-300 rounded-lg shadow-lg">
        {/* Header */}
        <div className="grid grid-cols-7 font-semibold bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 p-3 sticky top-0 z-10 shadow-md border-b border-gray-300">
          <div className="border-r border-gray-300 text-center text-sm">Date</div>
          <div className="border-r border-gray-300 text-center text-sm">Latitude</div>
          <div className="border-r border-gray-300 text-center text-sm">Longitude</div>
          <div className="border-r border-gray-300 text-center text-sm">Depth</div>
          <div className="border-r border-gray-300 text-center text-sm">Sea</div>
          <div className="border-r border-gray-300 text-center text-sm">State</div>
          <div className="text-center text-sm">Species</div>
        </div>

        {/* Data Rows */}
        {currentResults.map((item, index) => (
          <div
            key={item._id}
            className={`grid grid-cols-7 p-3 border-b border-gray-200 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } hover:bg-gray-100 transition-colors duration-300`}
          >
            <div className="border-r border-gray-300 text-center text-sm">
              {new Date(item.date).toLocaleDateString()}
            </div>
            <div className="border-r border-gray-300 text-center text-sm">
              {item.latitude}
            </div>
            <div className="border-r border-gray-300 text-center text-sm">
              {item.longitude}
            </div>
            <div className="border-r border-gray-300 text-center text-sm">
              {item.depth} m
            </div>
            <div className="border-r border-gray-300 text-center text-sm">{item.sea}</div>
            <div className="border-r border-gray-300 text-center text-sm">{item.state}</div>
            <div>
              {item.species.map((species, index) => (
                <div key={index} className="px-3">
                  <span className="font-medium">{species.name}</span>
                  {species.catch_weight && ` (${species.catch_weight} kg)`}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Prev
        </button>
        <span className="flex items-center px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataDisplay;