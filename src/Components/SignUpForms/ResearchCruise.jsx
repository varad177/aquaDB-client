import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { InputField } from "../Fields/InputField";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Loader"; // Assuming you have a Loader component for displaying the loading indicator
import { useNavigate } from "react-router-dom";
const ResearchCruiseForm = ({ email }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // State for loader visibility
  const [loading, setLoading] = useState(false);
const navigate=useNavigate();
  const onSubmit = async (data) => {
    // Map form data to match API payload structure
    const payload = {
      email: email, // prop email if not filled in form
      role: "user",
      userType: "research_cruises",
      additionalDetails: {
        cruise_name: data.cruiseName,
        cruise_id: data.cruiseId,
        research_institution: data.researchInstitution,
        cruise_area: data.cruiseArea,
        objective_of_cruise: data.objectiveOfCruise,
        contact_number: data.contactNumber,
        email: data.useremail,
      },
    };




    // Axios configuration
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://aquadb-server.onrender.com/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
    };

    setLoading(true); // Start loading

    // Send data to API
    try {
      const response = await axios.request(config);
      console.log("Response:", response.data);

      // Show success toast
      // Handle successful signup
      if (response.data.message) {
        toast.success(response.data.message);
        navigate("/signin");
        console.log("Signup successful:", response);
      }
    } catch (error) {
      console.error("Error:", error);

      // Check if the error response contains the user already exists message
      if (error.response && error.response.data) {
        if (error.response.data.message === "User already exists") {
          toast.error("User already exists. Please use a different email.");
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {loading && <Loader />} {/* Show loader while loading */}
      <form onSubmit={handleSubmit(onSubmit)}>
      {/* <h1 className="text-2xl font-medium text-left mb-8 text-gray-800">Hello Research Cruises</h1> */}
      <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField
            label="Cruise Name"
            name="cruiseName"
            placeholder="Enter cruise name"
            register={register}
            validation={{ required: "Cruise name is required" }}
            error={errors.cruiseName}
          />
          <InputField
            label="Cruise ID"
            name="cruiseId"
            placeholder="Enter cruise ID"
            register={register}
            validation={{ required: "Cruise ID is required" }}
            error={errors.cruiseId}
          />
          <InputField
            label="Research Institution"
            name="researchInstitution"
            placeholder="Enter institution name"
            register={register}
            validation={{ required: "Research institution is required" }}
            error={errors.researchInstitution}
          />
          <InputField
            label="Cruise Area"
            name="cruiseArea"
            placeholder="Enter cruise area"
            register={register}
            validation={{ required: "Cruise area is required" }}
            error={errors.cruiseArea}
          />
          <InputField
            label="Objective of Cruise"
            name="objectiveOfCruise"
            placeholder="Enter objective"
            register={register}
            validation={{ required: "Objective of cruise is required" }}
            error={errors.objectiveOfCruise}
          />
          <InputField
            label="Contact Number"
            name="contactNumber"
            placeholder="123-456-7890"
            register={register}
            validation={{
              required: "Contact number is required",
            }}
            error={errors.contactNumber}
          />
          <InputField
            label="Email"
            name="useremail"
            placeholder="Enter email address"
            register={register}
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email address",
              },
            }}
            error={errors.useremail}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-3xl text-lg w-[30%] py-3 mx-auto"
        >
          Sign Up
        </button>
      </form>
    </>
  );
};

export default ResearchCruiseForm;
