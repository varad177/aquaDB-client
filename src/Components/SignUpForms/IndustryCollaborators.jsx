import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../Fields/InputField";
import { apiConnector } from "../../ApiConnector";
import { toast } from "react-hot-toast";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
const IndustryCollaboratorForm = ({ email }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const onSubmit = async (data) => {
    console.log(data);

    const requestData = {
      email: email,
      password: "defaultPassword123",
      role: "user",
      userType: "industry-collaborators",
      additionalDetails: {
        organisation_name: data.organisation_name,
        organisation_type: data.organisation_type,
        organisation_contact_number: data.organisation_contact_number,
        registration_number: data.registration_number,
        contact_person: {
          name: data.contact_person_name,
          email: data.contact_person_email,
          contact: data.contact_person_contact,
        },
        data_contribution_type: data.data_contribution_type,
        geographical_focus_area: data.geographical_focus_area,
      },
    };

    setLoader(true);

    try {
      const response = await apiConnector(
        "post",
        "https://aquadb-server.onrender.com/signup",
        requestData,
        {
          "Content-Type": "application/json",
        }
      );

      // Handle successful signup
      if (response.data.message) {
        toast.success(response.data.message);
        navigate("/signin");
        console.log("Signup successful:", response);
      }
    } catch (error) {
      console.error("Signup failed:", error);

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
    }

    setLoader(false);
  };

  return (
    <div>
      {/* Loader */}
      {loader && <Loader />}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <h1 className="text-2xl font-medium mb-8 text-left text-gray-800">
          Hello Industry Collaborators
        </h1> */}
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField
            label="Organisation Name"
            name="organisation_name"
            placeholder="Organisation name"
            register={register}
            validation={{ required: "Organisation name is required" }}
            error={errors.organisation_name}
          />
          <InputField
            label="Organisation Type"
            name="organisation_type"
            placeholder="Organisation type"
            register={register}
            validation={{ required: "Organisation type is required" }}
            error={errors.organisation_type}
          />
          <InputField
            label="Organisation Contact Number"
            name="organisation_contact_number"
            placeholder="Contact number"
            register={register}
            validation={{
              required: "Contact number is required",
            }}
            error={errors.organisation_contact_number}
          />
          <InputField
            label="Registration Number"
            name="registration_number"
            placeholder="Registration number"
            register={register}
            validation={{ required: "Registration number is required" }}
            error={errors.registration_number}
          />
          <InputField
            label="Contact Person Name"
            name="contact_person_name"
            placeholder="Contact person name"
            register={register}
            validation={{ required: "Contact person name is required" }}
            error={errors.contact_person_name}
          />
          <InputField
            label="Contact Person Email"
            name="contact_person_email"
            type="email"
            placeholder="Contact person email"
            register={register}
            validation={{
              required: "Contact person email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email format",
              },
            }}
            error={errors.contact_person_email}
          />
          <InputField
            label="Contact Person Contact"
            name="contact_person_contact"
            placeholder="Contact person contact"
            register={register}
            validation={{
              required: "Contact person contact is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Contact must contain only numbers",
              },
            }}
            error={errors.contact_person_contact}
          />
          <InputField
            label="Data Contribution Type"
            name="data_contribution_type"
            placeholder="Data contribution type"
            register={register}
            validation={{ required: "Data contribution type is required" }}
            error={errors.data_contribution_type}
          />
          <InputField
            label="Geographical Focus Area"
            name="geographical_focus_area"
            placeholder="Geographical focus area"
            register={register}
            validation={{ required: "Geographical focus area is required" }}
            error={errors.geographical_focus_area}
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

export default IndustryCollaboratorForm;
