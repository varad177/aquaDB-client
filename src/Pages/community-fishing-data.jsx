import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx"; // Import xlsx

const decodeUrlData = (encodedString) => {
    try {
        const decodedString = atob(encodedString);
        const [communityId, type] = decodedString.split("-");
        return { communityId, type };
    } catch (error) {
        console.error("Failed to decode URL data:", error);
        return null;
    }
};

const FishingData = () => {

    let { shareURL } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const encodedString = shareURL;
            const decodedData = decodeUrlData(encodedString);

            if (!decodedData) {
                setError("Invalid encoded string.");
                setLoading(false);
                return;
            }

            const { communityId } = decodedData;
            
            console.log(communityId);
            

            try {
                const response = await axios.post(
                    "https://aquadb-server.onrender.com/scientist/fetch-community-Share-data",
                    { communityDataId: communityId }
                );
                
                console.log("API Response Data: ", response.data);  // Log the full response to understand its structure
                setData(response.data);  // Assuming response is an array or object that contains data
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shareURL]);

    const downloadExcel = () => {
        // Prepare the data for Excel
        const excelData = data.data.map((entry) => ({
            "Data ID": entry.dataId,
            "Date": new Date(entry.date).toLocaleDateString(),
            "Sea": entry.sea,
            "State": entry.state,
            "Depth (m)": entry.depth,
            "Total Weight (kg)": entry.total_weight,
            "Verified": entry.verified ? "Yes" : "No",
            "Species": entry.species.map((species) => `${species.name}: ${species.catch_weight} kg`).join(", ")
        }));

        // Create a worksheet from the data
        const ws = XLSX.utils.json_to_sheet(excelData);
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Fishing Data");

        // Generate the Excel file and download it
        XLSX.writeFile(wb, "Fishing_Data.xlsx");
    };

    if (loading) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-center text-black-700 mb-6">
                Fishing Data
            </h1>
            {!data ? (
                <div className="text-center text-gray-500">No data available.</div>
            ) : (
                <>
                    <button
                        onClick={downloadExcel}
                        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Download Excel
                    </button>
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Community: {data.community.name}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Uploaded by: {data.uploadedBy.username} ({data.uploadedBy.email})
                        </p>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-purple-200 text-left text-sm font-semibold text-gray-600 text-center">
                                        <th className="border border-gray-400 px-4 py-2">Data ID</th>
                                        <th className="border border-gray-400 px-4 py-2">Date</th>
                                        <th className="border border-gray-400 px-4 py-2">Sea</th>
                                        <th className="border border-gray-400 px-4 py-2">State</th>
                                        <th className="border border-gray-400 px-4 py-2">Depth (m)</th>
                                        <th className="border border-gray-400 px-4 py-2">Total Weight (kg)</th>
                                        <th className="border border-gray-400 px-4 py-2">Species</th>
                                        <th className="border border-gray-400 px-4 py-2">Verified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data && data.data.map((entry) => (
                                        <tr key={entry._id} className="hover:bg-gray-50">
                                            <td className="border border-gray-400 px-4 py-2 text-center">{entry.dataId}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                {new Date(entry.date).toLocaleDateString()}
                                            </td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">{entry.sea}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">{entry.state}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">{entry.depth}</td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">{entry.total_weight}</td>
                                            <td className="border border-gray-400 px-4 py-2">
                                                <ul className="list-disc list-inside">
                                                    {entry.species &&
                                                        entry.species.map((species) => (
                                                            <li key={species._id}>
                                                                {species.name}: {species.catch_weight} kg
                                                            </li>
                                                        ))}
                                                </ul>
                                            </td>
                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                {entry.verified ? "Yes" : "No"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};export default FishingData;    