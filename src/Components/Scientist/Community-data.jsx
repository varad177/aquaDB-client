import React from "react";

const CatchItemDetail = ({ catchItem }) => {
  console.log("Catch Item Details:", catchItem);

  return (
    <div className="bg-gray-100 rounded-lg p-6 mt-6 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black">
          Catch ID: {catchItem._id || "N/A"}
        </h3>
        <span className="text-sm text-black">
          Date: {catchItem.date ? new Date(catchItem.date).toLocaleDateString() : "N/A"}
        </span>
      </div>

      {/* Catch Details Table */}
      <table className="w-full text-sm text-black border-collapse border border-gray-300 table-fixed">
        <thead>
          <tr className="bg-purple-300 border border-gray-300">
            <th className="py-3 px-4 text-center font-medium border border-gray-300">
              Attribute
            </th>
            <th className="py-3 px-4 text-center font-medium border border-gray-300">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border border-gray-300">
            <td className="py-3 px-4 text-center border border-gray-300">
              Latitude
            </td>
            <td className="py-3 px-4 text-center border border-gray-300">
              {catchItem.latitude || "N/A"}
            </td>
          </tr>
          <tr className="border border-gray-300">
            <td className="py-3 px-4 text-center border border-gray-300">
              Longitude
            </td>
            <td className="py-3 px-4 text-center border border-gray-300">
              {catchItem.longitude || "N/A"}
            </td>
          </tr>
          <tr className="border border-gray-300">
            <td className="py-3 px-4 text-center border border-gray-300">
              Sea
            </td>
            <td className="py-3 px-4 text-center border border-gray-300">
              {catchItem.sea || "N/A"}
            </td>
          </tr>
          <tr className="border border-gray-300">
            <td className="py-3 px-4 text-center border border-gray-300">
              Depth
            </td>
            <td className="py-3 px-4 text-center border border-gray-300">
              {catchItem.depth || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="py-3 px-4 text-center border border-gray-300">
              Total Weight
            </td>
            <td className="py-3 px-4 text-center border border-gray-300">
              {catchItem.total_weight || "N/A"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Species Details */}
      <div className="mt-6">
        <h4 className="text-sm font-bold text-black mb-2">Species:</h4>
        <table className="w-full text-sm text-black border border-collapse border-gray-300 table-fixed">
          <thead>
            <tr className="bg-purple-300 border border-gray-300">
              <th className="py-3 px-4 text-center font-medium border border-gray-300">
                Name
              </th>
              <th className="py-3 px-4 text-center font-medium border border-gray-300">
                Catch Weight
              </th>
            </tr>
          </thead>
          <tbody>
            {catchItem.species && Array.isArray(catchItem.species) && catchItem.species.length > 0 ? (
              catchItem.species.map((species) => (
                <tr
                  key={species._id}
                  className="border-b border-gray-300 hover:bg-purple-50 transition duration-300"
                >
                  <td className="py-3 px-4 text-center border border-gray-300">
                    {species.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-center border border-gray-300">
                    {species.catch_weight || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="py-3 px-4 text-center border border-gray-300 text-gray-500"
                >
                  No species data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatchItemDetail;
