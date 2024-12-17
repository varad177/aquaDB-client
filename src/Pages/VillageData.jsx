import React, { useEffect, useState } from "react";
import axios from "axios";
import FishSpeciesCharts from "../Components/Scientist/FishDataCharts";

const DataTable2 = ({ filters }) => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [visualization, setVisualization] = useState(false);

    const headers = [
        { header: "Date", key: "date" },
        { header: "Latitude", key: "latitude" },
        { header: "Longitude", key: "longitude" },
        { header: "Village", key: "village" },
        { header: "Species", key: "species" },
    ];

    const truncateDecimals = (value, decimals) => {
        if (!value) return "-";
        return parseFloat(value).toFixed(decimals);
    };

    const openModal = (speciesData) => {
        setModalContent(speciesData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent({});
    };

    const fetchData = async () => {
        try {
            const response = await axios.post("https://aquadb-server.onrender.com/villagefilter", { filters });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header Navigation */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setVisualization(false)}
                    className={`w-1/2 py-3 text-lg font-semibold border bg-white text-gray-800 cursor-pointer hover:bg-gray-200"
                    } hover:bg-blue-100 transition`}
                >
                    Landing - Village
                </button>
                <button
                    onClick={() => setVisualization(true)}
                    className={`w-1/2 py-3 text-lg font-semibold border text-gray-800 cursor-pointer hover:bg-gray-200"
                    } hover:bg-blue-100 transition`}
                >
                    Visualization
                </button>
            </div>

            {visualization ? (
                <FishSpeciesCharts data={data} />
            ) : (
                <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-5 gap-4 p-4 bg-white shadow rounded-t-lg">
                        {headers.map((item, idx) => (
                            <div
                                key={idx}
                                className="text-center font-semibold text-gray-700 uppercase"
                            >
                                {item.header}
                            </div>
                        ))}
                    </div>

                    {/* Table Rows */}
                    {data.length ? (
                        data.map((item, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-5 gap-4 p-4 border-t ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                            >
                                {headers.map((field, idx) => (
                                    <div key={idx} className="text-center text-gray-600">
                                        {field.key === "date"
                                            ? new Date(item[field.key]).toLocaleDateString()
                                            : field.key === "latitude" || field.key === "longitude"
                                            ? truncateDecimals(item[field.key], 2)
                                            : field.key === "species" ? (
                                                <i
                                                    onClick={() => openModal(item[field.key])}
                                                    className="fa-solid fa-eye text-lg cursor-pointer text-gray-800 cursor-pointer hover:bg-gray-200"
                                                ></i>
                                            ) : (
                                                item[field.key]
                                            )}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-6 text-gray-500">No data available</div>
                    )}
                </div>
            )}

            {/* Modal for Species Data */}
            {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-3xl overflow-auto max-h-[80vh]">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Species Data</h2>
            <div className="overflow-auto">
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2 text-left">Species</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(modalContent).map(([key, value], idx) => (
                            <tr
                                key={key}
                                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                                <td className="border border-gray-300 px-4 py-2 text-left capitalize">
                                    {key.replace(/\./g, " ")}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                    {value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={closeModal}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
                Close
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default DataTable2;
