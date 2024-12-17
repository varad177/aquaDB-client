import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AnimationWrapper from "./Animation-page";
import {
  Button,
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Autocomplete } from "@mui/material";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const Addexcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openform, setopenform] = useState(false);
  const [modalText, setModalText] = useState("");
  const [downloadType, setDownloadType] = useState(""); // To keep track of the download type

  const [catchData, setCatchData] = useState({
    date: "",
    latitude: "",
    longitude: "",
    depth: "",
    species: [{ name: "", catch_weight: "" }],
    sea: "",
    state: "",
    userId: "", // Assuming userId is passed as a prop
    dataType: "",
    total_weight: 0,

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCatchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  const handleFileChange = (e) => {
    setCatchData((prevState) => ({
      ...prevState,
      file: e.target.files[0],
    }));
  };
  const handleSpeciesChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSpecies = [...catchData.species];
    updatedSpecies[index][name] = value;
    setCatchData((prevState) => ({
      ...prevState,
      species: updatedSpecies,
    }));
  };
  const handleAddSpecies = () => {
    setCatchData((prevState) => ({
      ...prevState,
      species: [...prevState.species, { name: "", catch_weight: "" }],
    }));
  };


  const handleRemoveSpecies = (index) => {
    const updatedSpecies = [...catchData.species];
    updatedSpecies.splice(index, 1);
    setCatchData((prevState) => ({
      ...prevState,
      species: updatedSpecies,
    }));
  };

  const handleSubmit = async (e) => {

    let loading = toast.loading("Please wait...");
    e.preventDefault();

    // Retrieve user data from localStorage
    let userInSession = localStorage.getItem("aquaUser");
    let { userId } = JSON.parse(userInSession);

    // Prepare the data object to send
    const requestData = {
      date: catchData.date,
      latitude: catchData.latitude,
      longitude: catchData.longitude,
      depth: catchData.depth,
      sea: catchData.sea,
      state: catchData.state,
      userId: userId,
      dataType: downloadType,
      total_weight: catchData.total_weight,
      dataId: catchData.dataId,
      species: catchData.species.map((species) => ({
        name: species.name,
        catch_weight: species.catch_weight,
      })),
    };

    try {
      // Make the API request to save data
      const response = await axios.post(
        "https://aquadb-server.onrender.com/user/other-data-upload",
        requestData, // Send data as JSON
        {
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
          },
        }
      );

      if (response.status == 200) {
        toast.dismiss(loading);
        toast.success("Data successfully added!");
        setopenform(false); // Close the modal on success
      }
    } catch (error) {
      toast.error("Error adding data");
    }
  };

  // Handle file drop
  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  // Handle rejected file types
  const onDropRejected = (rejectedFiles) => {
    toast.error("Invalid file type. Only .xlsx and .csv files are allowed.");
  };

  // Upload file to backend, which handles Cloudinary and MongoDB
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    if (!downloadType) {
      toast.error("Please select data type");
      return;
    }

    const user = localStorage.getItem("aquaUser");
    if (!user) {
      toast.error("User data not found");
      return;
    }

    const { userId } = JSON.parse(user);
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }
    console.log(userId);
    // const tag = downloadType;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId); // Pass the user ID along with the file
    formData.append("dataType", downloadType);
    // formData.append("tag", downloadType);

    const uploadToastId = toast.loading("Uploading...");
    let url = downloadType != "Landing-Village" ? "https://aquadb-server.onrender.com/upload" : "https://aquadb-server.onrender.com/uploadSpecies";
    try {
      setIsLoading(true);
      setUploadProgress(0);
      // Send the file to the backend
      const response = await axios.post(
        url,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      console.log("File uploaded successfully:", response.data);
      toast.success("File uploaded successfully", { id: uploadToastId });
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file", { id: uploadToastId });
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: ".xlsx,.csv",
  });

  // Handle download
  const handleDownload = (type) => {
    console.log(type)
    setDownloadType(type); // Set the download type (either "abundance" or "occurrence")
    setOpenModal(true); // Open the modal with instructions
  };

  // Confirm download and trigger the actual download
  const initiateDownload = async () => {
    // console.log(first)
    try {
      const response = await axios.get(
        `https://aquadb-server.onrender.com/download/${downloadType}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${downloadType}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setModalText(
        `You have downloaded the ${downloadType} file successfully.`
      );
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  let openForm = () => {
    console.log("varad");
    setDownloadType("other");
    setopenform(true);
    console.log(openForm);
  };

  return (
    <AnimationWrapper className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {
        downloadType === "other" &&
        <Modal open={openform} onClose={() => setopenform(false)}>
          <Box
            className="p-6 bg-white rounded-md shadow-lg"
            style={{
              width: "400px",
              margin: "100px auto",
              textAlign: "center",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => setopenform(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            >
              <Close />
            </IconButton>

            <h2>Add New Catch Record</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  value={catchData.date}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />

                {/* Latitude */}
                <TextField
                  label="Latitude"
                  type="number"
                  name="latitude"
                  value={catchData.latitude}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />

                {/* Longitude */}
                <TextField
                  label="Longitude"
                  type="number"
                  name="longitude"
                  value={catchData.longitude}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />

                {/* Depth */}
                <TextField
                  label="Depth"
                  type="number"
                  name="depth"
                  value={catchData.depth}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </div>

              {/* Species */}
              {catchData.species.map((species, index) => (
                <div key={index} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                      label={`Species Name ${index + 1}`}
                      name="name"
                      value={species.name}
                      onChange={(e) => handleSpeciesChange(index, e)}
                      required
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label={`Catch Weight ${index + 1}`}
                      name="catch_weight"
                      type="number"
                      value={species.catch_weight}
                      onChange={(e) => handleSpeciesChange(index, e)}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  </div>
                  <Button onClick={() => handleRemoveSpecies(index)} color="error" fullWidth>
                    Remove Species
                  </Button>
                </div>
              ))}
              <Button onClick={handleAddSpecies} variant="contained" fullWidth sx={{ mb: 2 }}>
                Add Species
              </Button>

              <div className="grid grid-cols-2 gap-4">
                {/* Sea */}
                <TextField
                  label="Sea"
                  name="sea"
                  value={catchData.sea}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />

                {/* State */}
                <TextField
                  label="State"
                  name="state"
                  value={catchData.state}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Total Weight */}
                <TextField
                  label="Total Weight"
                  name="total_weight"
                  type="number"
                  value={catchData.total_weight}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />


              </div>


              {/* Submit Button */}
              <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
                Submit
              </Button>
            </form>
          </Box>
        </Modal>
      }

      <div className="flex space-x-8">
        {/* Download Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 w-[600px] border-2 flex flex-col space-y-4">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Download Templates
          </h2>
          {/* PFZ Section */}
          <div className="bg-gray-100 shadow-sm rounded-lg p-4 flex flex-col items-center space-y-4 border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-700">PFZ/Non PFZ</h3>
            <button
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md shadow hover:bg-blue-600 transition-all duration-300 custom-pulse"
              onClick={() => handleDownload("pfz")}
              style={{
                width: "auto", // Adjust to content
              }}
            >
              Download PFZ/Non PFZ
            </button>
            <style>
              {`
      @keyframes customPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .custom-pulse {
        animation: customPulse 2s infinite;
      }
    `}
            </style>
          </div>

          {/* Landing Village Section */}
          <div className="bg-gray-100 shadow-sm rounded-lg p-4 flex flex-col items-center space-y-4 border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-700">Landing Village</h3>
            <button
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md shadow hover:bg-blue-600 transition-all duration-300 custom-pulse"
              onClick={() => handleDownload("Landing-Village")}
              style={{
                width: "auto", // Adjust to content
              }}
            >
              Download Landing Village
            </button>
            <style>
              {`
      @keyframes customPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .custom-pulse {
        animation: customPulse 2s infinite;
      }
    `}
            </style>
          </div>
          {/* Geo Referenced Data Section */}
          <div className="bg-gray-100 shadow-sm rounded-lg p-4 flex flex-col items-center space-y-4 border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-700">Geo Referenced Data</h3>
            <button
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md shadow hover:bg-blue-600 transition-all duration-300 custom-pulse"
              onClick={() => handleDownload("GEO-REF")}
              style={{
                width: "auto", // Adjust to content
              }}
            >
              Download Geo Referenced Data
            </button>
            <style>
              {`
      @keyframes customPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .custom-pulse {
        animation: customPulse 2s infinite;
      }
    `}
            </style>
          </div>
          {/* Abundance/Occurrence Section */}
          <div className="bg-gray-100 shadow-sm rounded-lg p-4 flex flex-col items-center space-y-4 border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-700">Data Abundance/Occurrence</h3>
            <button
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md shadow hover:bg-blue-600 transition-all duration-300 opacity-100 custom-pulse"
              onClick={() => handleDownload("AbuOcu")}
              style={{
                width: "auto", // Adjust to content
              }}
            >
              Download Abundance/Occurrence
            </button>
            <style>
              {`
      @keyframes customPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .custom-pulse {
        animation: customPulse 2s infinite;
      }
    `}
            </style>
          </div>
        </div>

        {/* Modal for Download Instructions */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            className="p-6 bg-white rounded-md shadow-lg"
            style={{
              width: "400px",
              margin: "100px auto",
              textAlign: "center",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => setOpenModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            >
              <Close />
            </IconButton>
            {/* <Typography variant="h6">Instructions for {downloadType}</Typography> */}
            <Typography variant="body1" className=" mt-4 text-gray-700">
              {downloadType === "AbuOcu" ? (
                <div>
                  <p className="text-lg font-semibold">
                    Abundance/Occurrence Module Instructions
                  </p>
                  <p className="mt-2">
                    <strong>FISHING_DATE [YYYY-MM-DD]:</strong> Enter the fishing date (e.g., 2024-12-02).
                  </p>
                  <p className="mt-2">
                    <strong>LATITUDE:</strong> Provide the latitude in decimal degrees (e.g., 15.6789).
                  </p>
                  <p className="mt-2">
                    <strong>LONGITUDE:</strong> Provide the longitude in decimal degrees (e.g., -74.1234).
                  </p>
                  <p className="mt-2">
                    <strong>DEPTH [IN METRES (M)]:</strong> Enter a single depth value in meters (e.g., 25). Avoid ranges like 25-30 m.
                  </p>
                  <p className="mt-2">
                    <strong>SPECIES_NAME:</strong> Enter species name in the format: <em>SpeciesName(Weight)</em> (e.g., Pomfret(400), Ponyfish(100)).
                  </p>
                  <p className="mt-2">
                    <strong>TOTAL_CATCH [IN KGS]:</strong> Provide the combined weight for all species (e.g., 500).
                  </p>
                  <p className="mt-4 text-center font-semibold text-blue-600">
                    Click the download button below to retrieve the file.
                  </p>
                </div>
              ) : downloadType === "Landing-Village" ? (
                <div>
                  <p className="text-lg font-semibold">
                    Landing Village Module Instructions
                  </p>
                  <p className="mt-2">
                    <strong>LATITUDE:</strong> Provide the latitude in decimal degrees (e.g., 15.6789).
                  </p>
                  <p className="mt-2">
                    <strong>LONGITUDE:</strong> Provide the longitude in decimal degrees (e.g., -74.1234).
                  </p>
                  <p className="mt-2">
                    <strong>VILLAGE NAME:</strong> Provide the village name.
                  </p>
                  <p className="mt-2">
                    <strong>FISHING_DATE [YYYY-MM-DD]:</strong> Enter the fishing date (e.g., 2024-12-02).
                  </p>
                  <p className="mt-2">
                    <strong>CATCH_WEIGHT:</strong> Enter the Catch Weight for each Species (e.g., Pomfret (10kg), Ponyfish(20kg)).
                  </p>
                  <p className="mt-4 text-center font-semibold text-blue-600">
                    Click the download button below to retrieve the file.
                  </p>
                </div>
              ) : downloadType === "GEO-REF" ? (
                <div>
                  <p className="text-lg font-semibold">
                    Geo Referenced Data Module Instructions
                  </p>
                  <p className="mt-2">
                    <strong>LATITUDE:</strong> Provide the latitude in decimal degrees (e.g., 15.6789).
                  </p>
                  <p className="mt-2">
                    <strong>LONGITUDE:</strong> Provide the longitude in decimal degrees (e.g., -74.1234).
                  </p>
                  <p className="mt-2">
                    <strong>SPECIES_NAME:</strong> List the observed species (e.g., Pomfret, Ponyfish).
                  </p>
                  <p className="mt-2">
                    <strong>FISHING_DATE [YYYY-MM-DD]:</strong> Enter the fishing date (e.g., 2024-12-02).
                  </p>
                  <p className="mt-2">
                    <strong>TOTAL_CATCH WEIGHT [IN KGS]:</strong> Field for total catch weight (e.g., 200).
                  </p>
                  <p className="mt-2">
                    <strong>LANDING NAME:</strong> Field for Landing Center Name.
                  </p>
                  <p className="mt-2">
                    <strong>GEAR TYPE:</strong> Field for Gear Type (e.g., Hooks and Lines).
                  </p>
                  <p className="mt-4 text-center font-semibold text-blue-600">
                    Click the download button below to retrieve the file.
                  </p>
                </div>
              ) : downloadType === "pfz" ? (
                <div>
                  <p className="text-lg font-semibold">
                    PFZ/Non PFZ Module Instructions
                  </p>
                  <p className="mt-2">
                    <strong>FISHING_DATE [YYYY-MM-DD]:</strong> Enter the fishing date (e.g., 2024-12-02).
                  </p>
                  <p className="mt-2">
                    <strong>SHOOT_LAT:</strong> Provide the latitude in decimal degrees (e.g., 15.6789).
                  </p>
                  <p className="mt-2">
                    <strong>SHOOT_LONG:</strong> Provide the longitude in decimal degrees (e.g., -74.1234).
                  </p>
                  <p className="mt-2">
                    <strong>DEPTH [IN METRES (M)]:</strong> Enter a single depth value in meters (e.g., 25). Avoid ranges like 25-30 m.
                  </p>
                  <p className="mt-2">
                    <strong>MAJOR_SPECIES:</strong> List the observed species (e.g., Pomfret, Ponyfish).
                  </p>
                  <p className="mt-2">
                    <strong>TOTAL_CATCH WEIGHT [IN KGS]:</strong> Optional field for total catch weight (e.g., 200).
                  </p>
                  <p className="mt-4 text-center font-semibold text-blue-600">
                    Click the download button below to retrieve the file.
                  </p>
                </div>
              ) : null}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={initiateDownload}
              className="mt-6"
            >
              Download{" "}
              {downloadType.charAt(0).toUpperCase() + downloadType.slice(1)}
            </Button>
          </Box>
        </Modal>

        {/* Upload Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 pt-1 w-[700px] flex flex-col items-center justify-center border-2 space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 p-6 text-center">
            Upload Data
          </h2>
          {/* Dropdown for Data Type Selection */}
          <div className="w-full mb-6 pb-9 flex flex-col items-center">
            <label
              htmlFor="dataType"
              className="block text-gray-600 font-medium p-3"
            >
              Select Data Type:
            </label>
            <div className="flex flex-col items-start">
              <select
                id="dataType"
                className="w-auto px-6 py-3 text-lg border border-[#C5AEDC] rounded-lg shadow-sm focus:ring-[#5E3D99] focus:border-[#5E3D99]"
                onChange={(e) => setDownloadType(e.target.value)}
                value={downloadType}
              >
                <option value="" disabled>
                  -- Choose an option --
                </option>
                <option value="PFZ/NON-PFZ">PFZ/Non-PFZ</option>
                <option value="Landing-Village">Landing Village</option>
                <option value="GEO-REF">Geo Referenced Data</option>
                <option value="obundance/accurrence">Data Occurrence/accurrence</option>
                <option value="others">Others</option>
              </select>
              {/* <h1 onClick={openForm}>other</h1> */}
              <button
                onClick={openForm}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Others / Disorganized Data
              </button>
              {/* </div> */}
              {/* {/* <div className="flex items-center gap-20 "> */}
              {/* <select
                  id="dataType"
                  className="w-auto px-4 py-2 border border-[#C5AEDC] rounded-lg shadow-sm focus:ring-[#5E3D99] focus:border-[#5E3D99]"
                  onChange={(e) => setDownloadType(e.target.value)}
                  value={downloadType}
                >
                  <option value="" disabled>
                    -- Choose an option --
                  </option>
                  <option value="abundance">Data Abundance</option>
                  <option value="occurrence">Data Occurrence</option>
                </select> */}

              {/* <button
                  onClick={openForm}
                 className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Others / Disorganized Data
                </button> */}
            </div>
          </div>
          <p className="text-gray-500 text-md text-center mb-3 -mt-2">
            Upload a CSV or Excel File
          </p>
          <div
            {...getRootProps()}
            className={`w-full max-w-xl h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all 
    ${isDragActive
                ? "border-purple-500 bg-purple-100"
                : "border-gray-100 bg-gray-100 hover:shadow-xl hover:border-purple-500"
              }`}
          >
            <input {...getInputProps()} disabled={isLoading} />
            <div className="relative w-20 h-20 mx-auto mb-2">
              {uploadProgress > 0 ? (
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${uploadProgress}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    textColor: "#6B46C1",
                    pathColor: "#6B46C1",
                    trailColor: "#E2E8F0",
                  })}
                />
              ) : (
                // Centered Image Overlapping Progress Bar Area

                // Centered Image Overlapping Progress Bar Area
                <img
                  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQuSrARSPAhLt7xK4AS8k6aSF9kmvbXao_Jg4LdBcxOV46EIStQ"
                  alt="Upload Illustration"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-full"
                />
              )}
            </div>
            {uploadProgress === 0 && (
              <p className="text-gray-600 font-medium mt-4">
                Drag & drop your file, or{" "}
                <span className="text-purple-600 underline cursor-pointer">
                  browse files
                </span>
              </p>
            )}
          </div>

          {selectedFile && (
            <div className="mt-4 w-full max-w-xl">
              <div className="flex justify-between items-center p-2 border rounded-lg bg-white shadow-sm">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div className="w-1/3">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm font-medium text-gray-600 ml-2">
                  {uploadProgress}%
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            className={`mt-6 px-6 py-3 mb-5 text-white font-semibold rounded-lg shadow-md transition-all 
            ${isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
              }`}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default Addexcel;
