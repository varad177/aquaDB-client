import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataTable = () => {
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        let userInSession = localStorage.getItem("aquaUser");

        if (userInSession) {
            let userid = JSON.parse(userInSession);

            axios
                .post('https://aquadb-server.onrender.com/user/get-log-data-by-id', { userid: userid.userId })
                .then((response) => {
                    setDatasets(response.data.data);
                })
                .catch((error) => {
                    console.error('Error fetching datasets:', error);
                });
        }
    }, []);

    // Function to handle viewing the rejection reason
    const handleViewReason = (rsn) => {
        alert(` ${rsn}`); // Replace with actual reason logic
    };

    return (
        <div className="container mx-auto p-4  bg-white w-full h-screen">
            <h1 className="text-2xl font-bold mb-4">Datasets</h1>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Dataset Name</th>
                        <th className="border border-gray-300 p-2">Data Status</th>
                        <th className="border border-gray-300 p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {datasets.map((dataset, index) => {
                        // Validate `dataStatus` and provide a fallback
                        const status =
                            typeof dataset.dataStatus === 'string'
                                ? dataset.dataStatus
                                : 'unknown'; // Fallback for invalid data

                        // Apply color classes based on the status
                        const rowClass =
                            status === 'accepted'
                                ? 'bg-green-100'
                                : status === 'rejected'
                                ? 'bg-red-100'
                                : status === 'pending'
                                ? 'bg-yellow-100'
                                : 'bg-gray-100';

                        return (
                            <tr key={dataset._id} className={rowClass}>
                                <td className="border border-gray-300 p-2">
                                    Dataset {index + 1}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </td>
                                <td className="border border-gray-300 p-2 text-center">
                                    {status === 'rejected' && (
                                        <button
                                            onClick={() => handleViewReason(dataset.reason)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            View Reason
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
