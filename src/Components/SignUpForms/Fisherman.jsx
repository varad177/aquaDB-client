// FishermanForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { InputField, SelectField } from "../Fields/InputField";
// import SelectField from "./Fields/SelectField";

const FishermanForm = ({ email }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log("EMAIL in fishermen", email);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    {/* <h1 className="text-2xl font-medium mb-8 text-gray-800 text-left">Hello Fishermen</h1> */}
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <InputField
          label="Name"
          name="name"
          placeholder="Enter your full name"
          register={register}
          validation={{ required: "Name is required" }}
          error={errors.name}
        />
        <InputField
          label="Fishing License Number"
          name="fishingLicenseNumber"
          placeholder="License number"
          register={register}
          validation={{ required: "License number is required" }}
          error={errors.fishingLicenseNumber}
        />
        <InputField
          label="Fishing Region"
          name="fishingRegion"
          placeholder="Enter fishing region"
          register={register}
          validation={{ required: "Fishing region is required" }}
          error={errors.fishingRegion}
        />
        <InputField
          label="Contact Number"
          name="contactNumber"
          placeholder="123-456-7890"
          register={register}
          validation={{
            required: "Contact number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid phone number format",
            },
          }}
          error={errors.contactNumber}
        />
        <InputField
          label="Vessel Registration Number"
          name="vesselRegistrationNumber"
          placeholder="Vessel registration number"
          register={register}
          validation={{ required: "Registration number is required" }}
          error={errors.vesselRegistrationNumber}
        />
        <InputField
          label="Vessel Size"
          name="vesselSize"
          placeholder="e.g., Small, Medium, Large"
          register={register}
          validation={{ required: "Vessel size is required" }}
          error={errors.vesselSize}
        />

        <SelectField
          label="Fishing Type"
          name="fishingType"
          options={["commercial", "subsistence", "recreational"]}
          register={register}
          validation={{ required: "Fishing type is required" }}
          error={errors.fishingType}
        />
      </div>

      <button
        type="submit"
        className="text-white bg-gradient-to-br from-blue-500 to-blue-900 hover:from-blue-500 hover:to-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-3xl text-lg w-[30%] py-3 mx-auto"
      >
       Sign Up
      </button>
    </form>
  );
};

export default FishermanForm;
