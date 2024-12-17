import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { InputField } from "../Fields/InputField";
import Loader from "../Loader";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const ResearchInstituteForm = ({ email }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    // Map form data to match API payload structure
    const payload = {
      email: email, // Use form email or fallback to prop email
      role: "user",
      userType: "research_institute",
      additionalDetails: {
        institution_name: data.instituteName,
        institution_code: data.instituteCode,
        contact_number: data.contactNumber,
        email: data.email,
        website: data.website,
        country: data.country,
        region: data.region,
        research_focus: data.researchFocus,
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

    // Send data to API
    setLoading(true);
    try {
      const response = await axios.request(config);
      console.log("Response:", response.data);
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
    <div>
      {loading && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <h1 className="text-2xl font-medium mb-8 text-left text-gray-800">
          Hello Research Institutes
        </h1> */}
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField
            label="Institute Name"
            name="instituteName"
            placeholder="Enter institute name"
            register={register}
            validation={{ required: "Institute name is required" }}
            error={errors.instituteName}
          />
          <InputField
            label="Institute Code"
            name="instituteCode"
            placeholder="Enter institute code"
            register={register}
            validation={{ required: "Institute code is required" }}
            error={errors.instituteCode}
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
            name="email"
            placeholder="Enter email address"
            register={register}
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email address",
              },
            }}
            error={errors.email}
          />
          <InputField
            label="Website"
            name="website"
            placeholder="Enter website URL"
            register={register}
            validation={{ required: "Website is required" }}
            error={errors.website}
          />
          <InputField
            label="Country"
            name="country"
            placeholder="Enter country"
            register={register}
            validation={{ required: "Country is required" }}
            error={errors.country}
          />
          <InputField
            label="Region"
            name="region"
            placeholder="Enter region"
            register={register}
            validation={{ required: "Region is required" }}
            error={errors.region}
          />
          <InputField
            label="Research Focus"
            name="researchFocus"
            placeholder="Enter research focus"
            register={register}
            validation={{ required: "Research focus is required" }}
            error={errors.researchFocus}
          />
        </div>

        <button
          type="submit"
          className="text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-3xl text-lg w-[30%] py-3 mx-auto"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default ResearchInstituteForm;
