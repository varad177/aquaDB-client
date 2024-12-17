import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "flowbite-react";
import * as XLSX from "xlsx";
import { Datepicker } from "flowbite-react";

const ScientistSavedDataSets = () => {
    const [groupedData, setGroupedData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    // Fetch and group data
    const fetchData = async () => {
        const userInSession = localStorage.getItem("aquaUser");

        if (!userInSession) {
            setError("User session not found. Please log in again.");
            return;
        }

        const { userId } = JSON.parse(userInSession);

        try {
            const response = await axios.post(
                `https://aquadb-server.onrender.com/scientist/getScientistSaveDataByUser`,
                { userId }
            );

            // Group data by _id
            const grouped = response?.data?.data?.map((group) => ({
                _id: group._id,
                name: group.name,
                uploadedBy: group.uploadedBy,
                filters: group.filters,
                datasets: group.data,
            }));
            setGroupedData(grouped || []);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("No Data Sets Available .");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Function to download data as Excel or CSV
    const handleDownload = (format) => {
        if (!selectedGroup) return;

        const dataToExport = selectedGroup.datasets.map((dataset) => ({
            "Created At": new Date(dataset.createdAt).toLocaleString(),
            "User ID": dataset.userId,
            Sea: dataset.sea,
            "Total Weight": `${dataset.total_weight} kg`,
            "Zone Type": dataset.zoneType,
            State: dataset.state,
            Species: dataset.species
                .map((species) => `${species.name} (${species.catch_weight} kg)`)
                .join(", "),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dataset Details");

        // Download as Excel or CSV based on format
        if (format === "excel") {
            XLSX.writeFile(workbook, "dataset_details.xlsx");
        } else if (format === "csv") {
            XLSX.writeFile(workbook, "dataset_details.csv", { bookType: "csv" });
        }
    };

    return (
        <div className="w-full h-full bg-gray-200 p-5 items-center">
            <h1 className="text-black text-3xl w-full text-center font-bold mb-4">Scientist Datasets</h1>
            
            
            {error && <p className="text-red-500">{error}</p>}

            {/* Modal for viewing datasets */}
            <Modal show={openModal} onClose={() => setOpenModal(false)} size="xl">
                <Modal.Header>Dataset Details</Modal.Header>
                <Modal.Body>
                    {selectedGroup ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">{selectedGroup.name}</h2>
                            {selectedGroup.datasets.map((dataset, idx) => (
                                <div key={idx} className="p-4 bg-gray-100 rounded-md">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">Created At</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {new Date(dataset.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">User ID</td>
                                                <td className="border border-gray-300 px-4 py-2">{dataset.userId}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">Sea</td>
                                                <td className="border border-gray-300 px-4 py-2">{dataset.sea}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">Total Weight</td>
                                                <td className="border border-gray-300 px-4 py-2">{dataset.total_weight} kg</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">Zone Type</td>
                                                <td className="border border-gray-300 px-4 py-2">{dataset.zoneType}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">State</td>
                                                <td className="border border-gray-300 px-4 py-2">{dataset.state}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">Species</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <ul>
                                                        {dataset.species.map((species) => (
                                                            <li key={species._id}>
                                                                {species.name} ({species.catch_weight} kg)
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No data to display.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button color="green" onClick={() => handleDownload("excel")}>
                        Download Excel
                    </Button>
                    <Button color="blue" onClick={() => handleDownload("csv")}>
                        Download CSV
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Dataset Table */}
            {groupedData.length > 0 ? (
                <div className="w-full flex justify-center items-center">
                    <div className="w-full max-w-4xl bg-white shadow-lg rounded-md overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 bg-purple-400 font-semibold py-4 px-5 border rounded-md">
                            <div className="text-center">Name</div>
                            <div className="text-center">Total Datasets</div>
                            <div className="text-right pr-[90px]">Actions</div>
                        </div>

                        {/* Table Rows */}
                        {groupedData.map((group) => (
                            <div
                                key={group._id}
                                className="grid grid-cols-3 items-center bg-white text-gray-900 py-3 px-4 border-b border-gray-300 hover:bg-gray-50"
                            >
                                <div className="text-center">{group.name}</div>
                                <div className="text-center">{group.datasets.length}</div>
                                <div className="text-right pr-20">
                                    <button
                                        onClick={() => {
                                            setSelectedGroup(group);
                                            setOpenModal(true);
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                    >
                                        <i className="fa-solid fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                !error && <p className="text-gray-500 text-center">No datasets available.</p>
            )}
        </div>
    );
};

export default ScientistSavedDataSets;
