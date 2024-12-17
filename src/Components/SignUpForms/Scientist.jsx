import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../Fields/InputField";
import { apiConnector } from "../../ApiConnector";
import { toast } from "react-hot-toast";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../aws";

const ScientistForm = ({ email }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

    const onSubmit = async (data) => {
        // Ensure the image is uploaded first before submitting form data
        if (!updatedProfileImg) {
            toast.error("Please upload a profile photo!");
            return;
        }

        // Construct request data to include image URL and other details
        const requestData = {
            email: email,
            role: "scientist",
            userType: "scientist",  // You can set this to a value if required
            additionalDetails: {
                fullName: data.fullName,
                contactNumber: data.contactNumber,
                organisation: data.organisation,
                designation: data.designation,
                scientistId: data.scientistId,
                photo: updatedProfileImg,  // Include the uploaded image URL here
            },
        };

        setLoader(true);

        try {
            const response = await apiConnector(
                "post",
                "https://aquadb-server.onrender.com/signup", // Your signup API endpoint
                requestData,
                {
                    "Content-Type": "application/json",
                }
            );

            // Handle the response from the server
            if (response.data.message) {
                toast.success(response.data.message);
                navigate("/signin"); // Redirect after successful signup
                console.log("Signup successful:", response);
            }
        } catch (error) {
            console.error("Signup failed:", error);

            // Handle error messages
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

    // Handle the image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImage(file).then((url) => {
                if (url) {
                    console.log(url);
                    setUpdatedProfileImg(url); // Save the image URL
                    toast.success("Image uploaded successfully!");
                } else {
                    toast.error("Image upload failed!");
                }
            }).catch(error => {
                console.error("Error uploading image:", error);
                toast.error("Image upload failed!");
            });
        }
    };
    

    return (
        <div>
            {/* Loader */}
            {loader && <Loader />}

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* <h1 className="text-2xl font-medium mb-8 text-left text-gray-800">
                    Hello Scientist
                </h1> */}
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <InputField
                        label="Full Name"
                        name="fullName"
                        placeholder="Full name"
                        register={register}
                        validation={{ required: "Full name is required" }}
                        error={errors.fullName}
                    />
                    <InputField
                        label="Contact Number"
                        name="contactNumber"
                        placeholder="Contact number"
                        register={register}
                        validation={{
                            required: "Contact number is required",
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "Contact must contain only numbers",
                            },
                        }}
                        error={errors.contactNumber}
                    />
                    <InputField
                        label="Organisation"
                        name="organisation"
                        placeholder="Organisation"
                        register={register}
                        validation={{ required: "Organisation is required" }}
                        error={errors.organisation}
                    />
                    <InputField
                        label="Designation"
                        name="designation"
                        placeholder="Designation"
                        register={register}
                        validation={{ required: "Designation is required" }}
                        error={errors.designation}
                    />
                    <InputField
                        label="Scientist ID"
                        name="scientistId"
                        placeholder="Scientist ID"
                        register={register}
                        validation={{ required: "Scientist ID is required" }}
                        error={errors.scientistId}
                    />
                    {/* Image Upload Field */}
                    <div className="mb-6">
                        <label htmlFor="photo" className="block text-gray-700 font-medium">
                            Profile Photo
                        </label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            accept="image/*"
                            className="mt-2 p-2 border border-gray-300 rounded-md"
                            onChange={handleImageUpload}
                        />
                        {updatedProfileImg && (
                            <p className="text-sm text-green-500 mt-2">Image uploaded successfully!</p>
                        )}
                    </div>
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

export default ScientistForm;
