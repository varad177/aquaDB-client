import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MapboxVisualization from "./Admin-map";
import { toast } from "react-hot-toast";
import AnimationWrapper from "./Animation-page";
import { Typography } from "@mui/material";
import Modal from "../Components/Modal";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
const Adminverifyfish = () => {
  const [catchData, setCatchData] = useState([]);
  const [selectedCatchIds, setSelectedCatchIds] = useState([]);
  const [editMode, setEditMode] = useState(false); // State to manage edit mode
  const [modifiedData, setModifiedData] = useState([]); // Track modified data
  const [viewMode, setViewMode] = useState("table"); // State to manage view mode (card or table)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRows, setshowRows] = useState(17);
  const [errorRows, setErrorRows] = useState([]);
  const [errorMessage, seterrorMessage] = useState([]);

  const [hoveredRow, setHoveredRow] = useState(null);

  let { userId, dataId, table } = useParams();
  console.log(table);
  // console.log("USER ID in frontend", userId);
  const [error, setError] = useState(null);

  const [totalRows, setTotalRows] = useState(0);
  const [uniqueSpecies, setUniqueSpecies] = useState(0);
  const [avgDepth, setAvgDepth] = useState(0);
  const [mostCommonSpecies, setMostCommonSpecies] = useState("");

  const [viewedRow, setviewedRow] = useState({ lat: 0.0, long: 0.0 });

  // Function to calculate Total Rows
  const getTotalRows = (data) => data.length;

  // Function to calculate Total Unique Species
  const getTotalUniqueSpecies = (data) => {
    const speciesSet = new Set();
    data.forEach((entry) => {
      entry.species.forEach((s) => speciesSet.add(s.name));
    });
    return speciesSet.size;
  };

  // Function to calculate Average Depth
  const getAverageDepth = (data) => {
    const totalDepth = data.reduce((sum, entry) => sum + entry.depth, 0);
    return data.length > 0 ? (totalDepth / data.length).toFixed(2) : 0;
  };

  // Function to find the Most Common Species
  const getMostCommonSpecies = (data) => {
    const speciesCount = {};
    data.forEach((entry) => {
      entry.species.forEach((s) => {
        speciesCount[s.name] = (speciesCount[s.name] || 0) + 1;
      });
    });

    let mostCommon = null;
    let maxCount = 0;

    for (const [species, count] of Object.entries(speciesCount)) {
      if (count > maxCount) {
        mostCommon = species;
        maxCount = count;
      }
    }

    return mostCommon;
  };

  const fetchCatchData = async () => {
    console.log("userId", userId);
    console.log("dataId", dataId);
    try {
      const response = await axios.post(
        "https://aquadb-server.onrender.com/admin/get-fish-data",
        { userId: userId, dataId: dataId }
      );
      console.log("CATCH DATA", response.data.data);

      setCatchData(response.data.data);
      setviewedRow({
        lat: response.data.data[0].catches[0].latitude.toFixed(3),
        long: response.data.data[0].catches[0].longitude.toFixed(3),
      });
      // console.log(response.data.data[0].catches.map((data) => {
      //   console.log("")
      // }));
      // response.data.data[0].catches.map((dataItem) => {
      //   console.log(dataItem._id)
      // })

      if (response.data) {
        setTotalRows(getTotalRows(response.data.data[0].catches));
        setUniqueSpecies(getTotalUniqueSpecies(response.data.data[0].catches));
        setAvgDepth(getAverageDepth(response.data.data[0].catches));
        setMostCommonSpecies(
          getMostCommonSpecies(response.data.data[0].catches)
        );
      } else console.log("gadbad hai");
    } catch (error) {
      console.error("Error fetching catch data:", error);
    }
  };

  useEffect(() => {
    fetchCatchData();
  }, []);

  useEffect(() => {
    // Listen for Ctrl + S (save) key press
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault(); // Prevent default browser save
        handleSaveChanges(); // Trigger save action
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Handle selecting and deselecting catch items
  const handleSelectCatch = (catchId) => {
    setSelectedCatchIds((prevSelectedIds) =>
      prevSelectedIds.includes(catchId)
        ? prevSelectedIds.filter((id) => id !== catchId)
        : [...prevSelectedIds, catchId]
    );
  };

  // Handle deleting a particular row
  const handleDeleteRow = async (catchId) => {
    try {
      await axios.delete("https://aquadb-server.onrender.com/admin/delete-catch", {
        data: { catchId },
      });
      setCatchData((prevData) =>
        prevData.map((userData) => ({
          ...userData,
          catches: userData.catches.filter(
            (catchItem) => catchItem._id !== catchId
          ),
        }))
      );
      alert("Row deleted successfully!");
    } catch (error) {
      console.error("Error deleting catch data:", error);
    }
  };

  // Handle editing the catch data
  const handleEditCatch = (catchId, editedCatchData) => {
    setCatchData((prevData) =>
      prevData.map((userData) => ({
        ...userData,
        catches: userData.catches.map((catchItem) =>
          catchItem._id === catchId
            ? { ...catchItem, ...editedCatchData }
            : catchItem
        ),
      }))
    );

    // Track modified data
    setModifiedData((prevModifiedData) => {
      const dataIndex = prevModifiedData.findIndex(
        (item) => item._id === catchId
      );
      if (dataIndex >= 0) {
        const updatedData = [...prevModifiedData];
        updatedData[dataIndex] = {
          ...updatedData[dataIndex],
          ...editedCatchData,
        };
        return updatedData;
      } else {
        return [
          ...prevModifiedData,
          { _id: catchId, ...editedCatchData }, // New modified item
        ];
      }
    });
  };

  // console.log("MODIFIED DATA", modifiedData);

  // Handle validation of catch data

  // const handleValidateCatch = async () => {
  //   console.log("handleValidateCatch Reaching Here");
  //   const loadingToast = toast.loading("Validating catch data..."); // Show loading toast
  //   try {
  //     console.log("Catch Data before validation:", catchData);
  //     let tag;
  //     // Transforming catch data to match the required format
  //     const transformedData = catchData.flatMap((userData) =>
  //       userData.catches.map((fishData) => ({
  //         tag: fishData.Type,
  //         _id: fishData?._id,
  //         date: fishData?.date.split("T")[0] || null, // Ensure valid date or default to null
  //         latitude: fishData?.latitude, // Extract latitude
  //         longitude: fishData?.longitude, // Extract longitude
  //         depth: fishData?.depth?.toString(), // Convert depth to string, default to "null"
  //         species: Array.isArray(fishData.species)
  //           ? fishData.species.map((speciesItem) => ({
  //               name: speciesItem?.name, // Default to "Unknown" if name is missing
  //               catch_weight: speciesItem?.catch_weight, // Default weight to 0
  //             }))
  //           : [],
  //         // Default to empty array if species is undefined
  //         total_weight: fishData?.total_weight, // Default to 0 if total_weight is missing
  //       }))
  //     );

  //     const payload = {
  //       dataType: tag,
  //       data: transformedData,
  //     };

  //     console.log("Transformed Payload:", payload);

  //     // Sending transformed data for validation
  //     const response = await axios.post(
  //       "https://aquadb-server.onrender.com/admin/autoCheck-fishing-data",
  //       payload
  //     );

  //     // Dismiss loading toast once request is complete
  //     toast.dismiss(loadingToast);

  //     if (response.status === 201) {
  //       toast.success("Catch data validated successfully!"); // Success toast
  //     } else if (response.status === 200) {
  //       toast.success("Data Already Validated");
  //     } else if (response.status === 202) {
  //       toast.success("Errors Arre hain jaise chaye hain vaise");
  //     } else {
  //       toast.error("Validation failed. Please try again."); // Error toast for non-200 responses
  //     }

  //     console.log("Validation Response:", response.data);
  //     console.log("Dekhte hai", response.data.errors);
  //     seterrorMessage(response.data.errors);

  //     const errorRows = response.data.errors.map((error) => error.row);
  //     // console.log("Errors are: " + errorRows);
  //     setErrorRows(errorRows);
  //   } catch (error) {
  //     console.error("Error validating catch data:", error);
  //     toast.error(
  //       "Error validating catch data. Please check the console for details."
  //     ); // Error toast
  //     toast.dismiss(loadingToast);
  //   }
  // };



  const handleValidateCatch = async () => {
    console.log("handleValidateCatch Reaching Here");
    const loadingToast = toast.loading("Validating catch data..."); // Show loading toast
    try {
      console.log("Catch Data before validation:", catchData);
      let tag; // Ensure you set this based on your logic
  
      // Transforming catch data to match the required format
      const transformedData = catchData.flatMap((userData) =>
        userData.catches.map((fishData) => ({
          tag: fishData.Type, // Assuming Type is still a valid field
          _id: fishData?._id,
          date: fishData?.date ? fishData.date.split("T")[0] : null, // Ensure valid date or default to null
          latitude: fishData?.latitude, // Extract latitude
          longitude: fishData?.longitude, // Extract longitude
          depth: fishData?.depth ? fishData.depth.toString() : null, // Convert depth to string, default to null
          species: Array.isArray(fishData.species)
            ? fishData.species.map((speciesItem) => ({
                name: speciesItem?.name || "Unknown", // Default to "Unknown" if name is missing
                catch_weight: speciesItem?.catch_weight || 0, // Default weight to 0 if missing
              }))
            : [],
          total_weight: fishData?.total_weight || 0, // Default to 0 if total_weight is missing
          Gear_type: fishData?.Gear_type || null, // Extract Gear_type or default to null
          meanlength: fishData?.meanlength || null, // Extract meanlength or default to null
          stage: fishData?.stage || null, // Extract stage or default to null
        }))
      );
  
      const payload = {
        dataType: tag,
        data: transformedData,
      };
  
      console.log("Transformed Payload:", payload);
  
      // Sending transformed data for validation
      const response = await axios.post(
        "https://aquadb-server.onrender.com/admin/autoCheck-fishing-data",
        payload
      );
  
      // Dismiss loading toast once request is complete
      toast.dismiss(loadingToast);
  
      if (response.status === 201) {
        toast.success("Catch data validated successfully!"); // Success toast
      } else if (response.status === 200) {
        toast.success("Data Already Validated");
      } else if (response.status === 202) {
        toast.success("Errors found in the data."); // Updated message for clarity
      } else {
        toast.error("Validation failed. Please try again."); // Error toast for non-200 responses
      }
  
      console.log("Validation Response:", response.data);
      
      if (response.data.errors && response.data.errors.length > 0) {
        console.log("Errors:", response.data.errors);
        seterrorMessage(response.data.errors); // Set error messages for display
  
        const errorRows = response.data.errors.map((error) => error.row);
        setErrorRows(errorRows); // Set error rows for highlighting in UI
      } else {
        seterrorMessage([]); // Clear error messages if none found
        setErrorRows([]); // Clear error rows if none found
      }
      
    } catch (error) {
      console.error("Error validating catch data:", error);
      toast.error(
        "Error validating catch data. Please check the console for details."
      ); // Error toast
      toast.dismiss(loadingToast);
    }
  };
  

  const toggleViewMode = () => {
    setViewMode((preMode) => (preMode === "card" ? "table" : "card"));
  };

  const handleViewRow = (data) => {
    setviewedRow({ lat: data.lat, long: data.long });
  };

  const handleLoadMore = () => {
    setshowRows(showRows + 20);
  };

  const handleShowLess = () => {
    setshowRows(17);
  };

  const rejectdata = async () => {
    const reason = prompt("Please provide a reason for rejecting the data:");
    if (!reason) {
      toast.error("Reason is required to reject the data.");
      return; // If no reason is provided, do nothing
    }

    try {
      let loading = toast.loading("Loading...");
      const res = await axios.post(
        "https://aquadb-server.onrender.com/admin/reject-log-data",
        {
          dataId: dataId,
          status: "rejected",
          reason: reason, // Send the reason with the request
        }
      );

      toast.dismiss(loading);
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const acceptData = async () => {
    try {
      let loading = toast.loading("Loading...");
      const res = await axios.post(
        "https://aquadb-server.onrender.com/admin/accept-log-data",
        {
          dataId: dataId,
          status: "accepted",
        }
      );
      toast.dismiss(loading);
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSaveClick = () => {
    setIsModalOpen(true); // Open the modal to confirm save
  };

  // When the user clicks 'Cancel' in the modal, close it without doing anything
  const handleSubmit = async () => {
    // Transform the data to the format expected by the backend
    // const transformedData = catchData.flatMap((userData) =>
    //   userData.catches.map((fishData) => ({
    //     dataId: fishData?.dataId || "", // Ensure dataId is never null, fallback to empty string if missing
    //     date: fishData?.date?.split("T")[0] || "", // Format date, fallback to empty string if missing
    //     latitude: fishData?.latitude || 0, // Ensure latitude is never null, fallback to 0 if missing
    //     longitude: fishData?.longitude || 0, // Ensure longitude is never null, fallback to 0 if missing
    //     depth: fishData?.depth || "", // Fallback to empty string if depth is missing
    //     species: Array.isArray(fishData?.species)
    //       ? fishData.species.map((speciesItem) => ({
    //           name: speciesItem?.name || "", // Fallback to empty string if name is missing
    //           catch_weight: speciesItem?.catch_weight || 0, // Fallback to 0 if catch_weight is missing
    //         }))
    //       : [],
    //     sea: fishData?.sea,
    //     state: fishData?.state,
    //     total_weight: fishData?.total_weight || 0, // Default to 0 if total_weight is missing
    //     dataType: fishData?.dataType || "", // Ensure tag is never null, fallback to empty string if missing
    //     userId: fishData?.userId || "", // Ensure userId is never null, fallback to empty string if missing
    //   }))
    // );

    const transformedData = catchData.flatMap((userData) =>
      userData.catches.map((fishData) => ({
        dataId: fishData?.dataId || "", // Ensure dataId is never null, fallback to empty string if missing
        date: fishData?.date?.split("T")[0] || "", // Format date, fallback to empty string if missing
        latitude:
          fishData?.latitude === null
            ? null
            : parseFloat(fishData.latitude) || 0, // Convert to number or keep as null
        longitude:
          fishData?.longitude === null
            ? null
            : parseFloat(fishData.longitude) || 0, // Convert to number or keep as null
        depth: fishData?.depth || "", // Fallback to empty string if depth is missing
        species: Array.isArray(fishData?.species)
          ? fishData.species.map((speciesItem) => ({
              name: speciesItem?.name || "", // Fallback to empty string if name is missing
              catch_weight:
                speciesItem?.catch_weight === null ||"NaN"
                  ? null
                  : parseFloat(speciesItem.catch_weight) || 0, // Convert to number or keep as null
            }))
          : [],
        sea: fishData?.sea,
        state: fishData?.state,
        total_weight:
          fishData?.total_weight === null
            ? null
            : parseFloat(fishData.total_weight) || 0, // Convert to number or keep as null
        dataType: fishData?.dataType || "", // Ensure tag is never null, fallback to empty string if missing
        userId: fishData?.userId || "", // Ensure userId is never null, fallback to empty string if missing
        zoneType:fishData?.zonetype||"",
        LANDINGNAM:fishData?.LANDINGNAM||"",
        Gear_type:fishData?.Gear_type || "",
        region:fishData?.region||"",

      }))
    );

    console.log("transformedData", transformedData);

    try {
      setIsLoading(true); // Show loading state
      const loadingToastId = toast.loading("Saving data..."); // Show a "saving..." toast notification and store the toast ID

      // Send transformed data to the backend to save
      const response = await axios.post(
        "https://aquadb-server.onrender.com/admin/saveValidatedData", // Ensure the URL is correct
        { data: transformedData } // Send data as "data", not "validatedData"
      );

      console.log("response after saving data", response);

      // Dismiss the loading toast
      toast.dismiss(loadingToastId);

      if (response.status === 200) {
        console.log("Data saved and verified successfully");

        // Show success toast
        toast.success("Data saved successfully!", { autoClose: 3000 });
      } else if (response.status === 202) {
        toast.success("Data already saved! No need to save again", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error saving data", error);

      // Dismiss the loading toast in case of error
      toast.dismiss(loadingToastId);

      // Show error toast
      toast.error("Error saving data. Please try again.", { autoClose: 3000 });
    }

    setIsLoading(false); // Stop loading state
    setIsModalOpen(false); // Close the modal
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Simply close the modal without submitting
  };

  return (
    <div className="bg-white p-6">
      <Typography variant="h4" color="black">
        Admin Dashboard
      </Typography>

      <div
        className="flex justify-between gap-5 mt-3 h-[88vh]"
        style={{ overflowY: "hidden" }}
      >
        <div className="w-[45%]">
          <div className="rounded-xl">
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="rounded-xl border border-lg border-purple-200">
                <div className="flex-1 p-3 bg-white rounded-xl text-center text-lg text-blue-900">
                  Total Rows: <br /> <strong>{totalRows}</strong>
                </div>
              </div>
              <div className="rounded-xl border border-lg border-purple-200">
                <div className="flex-1 p-3 bg-white rounded-xl text-center text-lg text-blue-900">
                  Unique Species: <br /> <strong>{uniqueSpecies}</strong>
                </div>
              </div>
              <div className="rounded-xl border border-lg border-purple-200">
                <div className="flex-1 p-3 bg-white rounded-xl text-center text-lg text-blue-900">
                  Avg Depth: <br /> <strong>{avgDepth} m</strong>
                </div>
              </div>
              <div className="rounded-xl border border-lg border-purple-200">
                <div className="flex-1 p-3 bg-white rounded-xl text-center text-lg text-blue-900">
                  Most Common Species: <strong>{mostCommonSpecies}</strong>
                </div>
              </div>
            </div>

            <MapboxVisualization
              catchData={catchData}
              props={{ type: "markers", showButton: true }}
            />

            <h4 className="text-xl font-medium mt-7">
              View Single Point{" "}
              <span className="font-light">
                lat: {viewedRow.lat} long: {viewedRow.long}
              </span>{" "}
            </h4>

            <div className="mt-3">
              <div>
                <MapboxVisualization
                  catchData={catchData}
                  props={{
                    type: "markers",
                    showButton: false,
                    oneLat: viewedRow.lat,
                    oneLong: viewedRow.long,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-[55%]  overflow-y-auto">
          <AnimationWrapper className="text-white rounded-lg  max-w-screen-lg mx-auto">
            {/* <h1 className="text-2xl font-bold mb-4 text-black">Admin Dashboard</h1> */}

            {viewMode === "card" ? (
              <div className="space-y-4">
                {catchData.map((data) => (
                  <div key={data._id} className="border-b border-gray-700 py-4">
                    <h2 className="text-lg font-semibold text-indigo-400 mb-2">
                      User ID: {data._id}
                    </h2>

                    {data.catches.map((catchItem) => (
                      <div
                        key={catchItem._id}
                        className="border bg-gray-900 border-gray-700 p-4 rounded-lg mb-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-semibold text-gray-400">
                            Catch ID: {catchItem._id}
                          </h3>
                          {editMode && (
                            <button
                              className="bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                              onClick={() => handleDeleteRow(catchItem._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="text-xs text-gray-400">
                              Date:
                            </label>
                            <input
                              type="date"
                              value={
                                new Date(catchItem.date)
                                  .toISOString()
                                  .split("T")[0]
                              }
                              onChange={(e) =>
                                handleEditCatch(catchItem._id, {
                                  date: e.target.value,
                                })
                              }
                              readOnly={!editMode}
                              className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-400">
                              Latitude:(Float)
                            </label>
                            <input
                              type="number"
                              value={catchItem.latitude}
                              onChange={(e) =>
                                handleEditCatch(catchItem._id, {
                                  latitude: parseFloat(e.target.value),
                                })
                              }
                              readOnly={!editMode}
                              className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-400">
                              Longitude:(Float)
                            </label>
                            <input
                              type="number"
                              value={catchItem.longitude}
                              onChange={(e) =>
                                handleEditCatch(catchItem._id, {
                                  longitude: parseFloat(e.target.value),
                                })
                              }
                              readOnly={!editMode}
                              className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-400">
                              Sea:
                            </label>
                            <input
                              type="number"
                              value={catchItem.sea || ""}
                              onChange={(e) =>
                                handleEditCatch(catchItem._id, {
                                  sea: parseFloat(e.target.value),
                                })
                              }
                              readOnly={!editMode}
                              className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-400">
                              Depth:
                            </label>
                            <input
                              type="number"
                              value={catchItem.depth || ""}
                              onChange={(e) =>
                                handleEditCatch(catchItem._id, {
                                  depth: parseInt(e.target.value),
                                })
                              }
                              readOnly={!editMode}
                              className="bg-gray-800 text-white p-2 rounded-md w-full text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 mt-4">
                          <label className="text-xs text-gray-400">
                            Species:
                          </label>
                          <div className="flex gap-8 flex-wrap">
                            {catchItem.species.map((species) => (
                              <div
                                key={species._id}
                                className="flex justify-between items-center text-sm gap-2"
                              >
                                <span>{species.name}</span>
                                <input
                                  type="number"
                                  value={species.catch_weight}
                                  onChange={(e) =>
                                    handleEditCatch(catchItem._id, {
                                      species: catchItem.species.map((s) =>
                                        s._id === species._id
                                          ? {
                                              ...s,
                                              catch_weight: parseInt(
                                                e.target.value
                                              ),
                                            }
                                          : s
                                      ),
                                    })
                                  }
                                  readOnly={!editMode}
                                  className="bg-gray-700 text-white p-2 rounded-md w-16 text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="text-xs text-gray-400">
                            Total Weight:
                          </label>
                          <input
                            type="number"
                            value={catchItem.total_weight}
                            onChange={(e) =>
                              handleEditCatch(catchItem._id, {
                                total_weight: parseInt(e.target.value),
                              })
                            }
                            readOnly={!editMode}
                            className="bg-gray-700 text-white p-2 rounded-md w-full text-xs"
                          />
                        </div>

                        {editMode && (
                          <button
                            onClick={() => {
                              handleSaveChanges();
                              setEditMode(false);
                            }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md mt-4 text-xs"
                          >
                            Save Changes
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto p-3 rounded-lg border border-lg border-purple-200  overflow-y-auto">
                <div className="flex justify-between">
                  <h2 className="text-black text-xl font-bold mb-3">
                    Fish Catch Distribution
                  </h2>
                  <div>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mb-6 text-base font-semibold"
                    >
                      {editMode ? "Disable Edit Mode" : "Enable Edit Mode"}
                    </button>
                    <button
                      onClick={handleSaveClick}
                      className="bg-green-500  hover:bg-green-600 text-white px-4 py-2 rounded-md mb-6 ml-2 text-base font-semibold"
                    >
                      Save
                    </button>

                    {/* <button
                      onClick={acceptData}
                      className="bg-teal-500 hidden hover:hover:bg-teal-600  text-white px-4 py-2 rounded-md mb-6 ml-2 text-base font-semibold "
                    >
                      Accept
                    </button>
                    <button
                      onClick={rejectdata}
                      className="bg-red-500 hidden hover:bg-red-600  text-white px-4 py-2 rounded-md mb-6 ml-2 text-base font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={handleValidateCatch} // Validate button
                      // onClick={handleValidate}
                      className="bg-yellow-500 hidden hover:bg-yellow-600  text-white px-4 py-2 rounded-md mb-6 ml-2 text-base font-semibold"
                    >
                      Validate
                    </button> */}
                    <button
                      onClick={toggleViewMode}
                      className="bg-red-600 hidden text-white px-4 py-2 rounded-md mb-6 ml-2 text-base font-semibold"
                    >
                      {viewMode === "table" ? "Card View" : "Table View"}
                    </button>
                  </div>
                </div>
                <table className="min-w-full table-auto text-left lg:table-fixed">
                  {/* check the table css lg:table fixed */}
                  <thead className="sticky top-0">

                    { table === "PFZ/NON-PFZ" && <tr className="bg-gray-300">
                      {/* <th className="text-xs text-gray-400 border border-gray-200">
                          Catch ID
                        </th> */}
                        <th className="p-2 text-xs text-black">Actions</th>
                      <th className="p-2 text-xs text-black">Fishing Date</th>
                      <th className="p-2 text-xs text-black">
                        Latitude: (Float)
                      </th>
                      <th className="p-2 text-xs text-black">
                        Longitude: (Float)
                      </th>
                      <th className="p-2 text-xs text-black">
                        Depth (Integer)
                      </th>
                      <th className="p-2 text-xs text-black">Major Species</th>
                    </tr> }

                    { table === "Landing_Village" && <tr className="bg-gray-300">
                      {/* <th className="text-xs text-gray-400 border border-gray-200">
                          Catch ID
                        </th> */}
                        <th className="p-2 text-xs text-black">Actions</th>
                      <th className="p-2 text-xs text-black">Longitude</th>
                      <th className="p-2 text-xs text-black">Longitude</th>
                      <th className="p-2 text-xs text-black">
                        Village
                      </th>
                      <th className="p-2 text-xs text-black">
                        Date
                      </th>
                      <th className="p-2 text-xs text-black">Species</th>
                    </tr> }

                    { table === "GEO-REF" && <tr className="bg-gray-300">
                      {/* <th className="text-xs text-gray-400 border border-gray-200">
                          Catch ID
                        </th> */}
                      <th className="p-2 text-xs text-black">Actions</th>
                      <th className="p-2 text-xs text-black">Date</th>
                      <th className="p-2 text-xs text-black">
                        Species Name
                      </th>
                      <th className="p-2 text-xs text-black">
                        Catch (kg)
                      </th>
                      <th className="p-2 text-xs text-black">
                        Landing Name
                      </th>
                      <th className="p-2 text-xs text-black">Gear type</th>
                    </tr> }

                    { table === "abundance" && <tr className="bg-gray-300">
                      {/* <th className="text-xs text-gray-400 border border-gray-200">
                          Catch ID
                        </th> */}
                      <th className="p-2 text-xs text-black">Actions</th>
                      <th className="p-2 text-xs text-black">Date</th>
                      <th className="p-2 text-xs text-black">
                        Latitude: (Float)
                      </th>
                      <th className="p-2 text-xs text-black">
                        Longitude: (Float)
                      </th>
                      <th className="p-2 text-xs text-black">
                        Depth (Integer)
                      </th>
                      <th className="p-2 text-xs text-black">Species</th>
                      <th className="p-2 text-xs text-black">Total Weight</th>
                    </tr> }

                    { table === "occurrence" && <tr className="bg-gray-300">
                      {/* <th className="text-xs text-gray-400 border border-gray-200">
                          Catch ID
                        </th> */}
                      <th className="p-2 text-xs text-black">Actions</th>
                      <th className="p-2 text-xs text-black">Date</th>
                      <th className="p-2 text-xs text-black">
                        Latitude: (Float)
                      </th>
                      <th className="p-2 text-xs text-black">
                        Longitude: (Float)
                      </th>
                      <th className="p-2 text-xs text-black">
                        Depth (Integer)
                      </th>
                      <th className="p-2 text-xs text-black">Species</th>
                    </tr> }

                  </thead>
                  <tbody>
                    {catchData.map((data) =>
                      data.catches
                        .slice(0, showRows)
                        .map((catchItem, index) => (
                          <tr
                            key={catchItem._id}
                            className={`border-b border-gray-200
                            ${errorRows.includes(index) ? " bg-red-100" : ""} `}
                            onMouseEnter={() => setHoveredRow(index)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            {/* <td className="p-2 text-xs text-gray-400 border border-gray-200">
                              {catchItem._id}
                            </td> */}

                            <td className="text-xs text-gray-300 border-gray-200">
                              {editMode === true ? (
                                <button
                                  className="bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                                  onClick={() => handleDeleteRow(catchItem._id)}
                                >
                                  "Delete"
                                </button>
                              ) : hoveredRow === index &&
                                errorRows?.includes(index) ? (
                                <div className="absolute">
                                  <div className="bg-white border rounded shadow-md text-xs text-red-500 p-2 top-full mt-1 left-0 top-0 z-10">
                                    <div className="flex items-center space-x-2">
                                      <span>
                                        {errorMessage
                                          .filter(
                                            (err) => err.row === hoveredRow
                                          ) // Filter errors for the hovered row
                                          .map(
                                            (
                                              err,
                                              idx // Map over the filtered errors
                                            ) => (
                                              <div key={idx}>{err.message}</div> // Render each error message
                                            )
                                          )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : errorRows.includes(index) ? (
                                <button
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    color: "blue",
                                  }}
                                  // onClick={() =>
                                  //   handleViewRow({
                                  //     lat: catchItem.latitude.toFixed(3),
                                  //     long: catchItem.longitude.toFixed(3),
                                  //   })
                                  // }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="w-6 h-6 text-red-500"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M12 2a10 10 0 100 20 10 10 0 000-20zM10.75 8.5a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zM12 15.25a.75.75 0 110 1.5.75.75 0 010-1.5z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    color: "blue",
                                  }}
                                  onClick={() =>
                                    handleViewRow({
                                      lat: catchItem.latitude.toFixed(3),
                                      long: catchItem.longitude.toFixed(3),
                                    })
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    fill="currentColor"
                                  >
                                    <path d="M572.52 241.4C518.78 135.6 404.78 64 288 64S57.22 135.6 3.48 241.4a48.16 48.16 0 0 0 0 29.2C57.22 376.4 171.22 448 288 448s230.78-71.6 284.52-177.4a48.16 48.16 0 0 0 0-29.2zM288 400c-70.58 0-128-57.42-128-128s57.42-128 128-128 128 57.42 128 128-57.42 128-128 128zm0-208a80 80 0 1 0 80 80 80.09 80.09 0 0 0-80-80z" />
                                  </svg>
                                </button>
                              )}
                            </td>

                            <td className="text-xs text-gray-400 p-0">
                              <input
                                type="date"
                                value={
                                  new Date(catchItem.date)
                                    .toISOString()
                                    .split("T")[0]
                                }
                                onChange={(e) =>
                                  handleEditCatch(catchItem._id, {
                                    date: e.target.value,
                                  })
                                }
                                readOnly={!editMode}
                                className="text-black w-full text-xs"
                                style={{
                                  border: "none",
                                  margin: 0,
                                  background: "transparent",
                                }}
                              />
                            </td>
                            <td className="text-xs text-gray-400 border-b border-gray-200">
                              <input
                                style={{
                                  border: "none",
                                  background: "transparent",
                                }}
                                type="number"
                                value={catchItem.latitude.toFixed(3)}
                                onChange={(e) =>
                                  handleEditCatch(catchItem._id, {
                                    latitude: parseFloat(e.target.value),
                                  })
                                }
                                readOnly={!editMode}
                                className="text-black w-full text-xs"
                              />
                            </td>
                            <td className="text-xs text-gray-400 border-b border-gray-200">
                              <input
                                style={{
                                  border: "none",
                                  background: "transparent",
                                }}
                                type="number"
                                value={catchItem.longitude.toFixed(3)}
                                onChange={(e) =>
                                  handleEditCatch(catchItem._id, {
                                    longitude: parseFloat(e.target.value),
                                  })
                                }
                                readOnly={!editMode}
                                className="text-black w-full text-xs"
                              />
                            </td>
                            <td className="text-xs text-gray-400 border-b border-gray-200">
                              <input
                                style={{
                                  border: "none",
                                  background: "transparent",
                                }}
                                type="number"
                                value={catchItem.depth || ""}
                                onChange={(e) =>
                                  handleEditCatch(catchItem._id, {
                                    depth: parseInt(e.target.value),
                                  })
                                }
                                readOnly={!editMode}
                                className="text-black w-full text-xs"
                              />
                            </td>
                            <td className=" text-xs text-gray-400 border-b border-gray-200">
                              <select
                                style={{
                                  border: "none",
                                  background: "transparent",
                                }}
                                value={
                                  catchItem.species.find((s) => s.selected)
                                    ?._id || ""
                                }
                                onChange={(e) => {
                                  const selectedSpeciesId = e.target.value;
                                  const updatedSpecies = catchItem.species.map(
                                    (species) =>
                                      species._id === selectedSpeciesId
                                        ? { ...species, selected: true }
                                        : { ...species, selected: false }
                                  );
                                  handleEditCatch(catchItem._id, {
                                    species: updatedSpecies,
                                  });
                                }}
                                className="text-black w-full text-xs"
                              >
                                <option value="" disabled>
                                  Name
                                </option>
                                {catchItem.species.map((species) => (
                                  <option key={species._id} value={species._id}>
                                    {species.name} ({species.catch_weight})
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="text-xs text-gray-400 border-b border-gray-200">
                              <input
                                style={{
                                  border: "none",
                                  background: "transparent",
                                }}
                                type="number"
                                value={catchItem.total_weight}
                                onChange={(e) =>
                                  handleEditCatch(catchItem._id, {
                                    total_weight: parseInt(e.target.value),
                                  })
                                }
                                readOnly={!editMode}
                                className="text-black w-full text-xs"
                              />
                            </td>
                            {/* Actions column with border (Delete button) */}
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>

                <button
                  onClick={() => handleLoadMore()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md mt-6 text-xs"
                >
                  Load more
                </button>

                <button
                  onClick={() => handleShowLess()}
                  className="bg-red-600 text-white px-4 py-2 rounded-md ml-3 text-xs"
                >
                  Show less
                </button>
              </div>
            )}
          </AnimationWrapper>
        </div>
      </div>
      {/* Modal for confirmation */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCancel}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold">
              Are you sure you want to save the data?
            </h3>
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                {isLoading ? "Saving..." : "Submit"}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adminverifyfish;