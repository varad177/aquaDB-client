{/*"ALL CATEGORIES" FILTER IS TO BE ADDED... */}


import React, { useEffect, useState } from "react";

import { Button, Modal } from "flowbite-react";
import AnimationWrapper from "./Animation-page";
import axios from "axios";
import toast from "react-hot-toast";
import unveryfiedusers from "../assets/unveryfiedusers.png";

const Adminverifyuser = () => {
  const [users, setUser] = useState([]);
  const [userType, setUserType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [detailData, setDetailData] = useState("");

  useEffect(() => {
    // Run this effect whenever userType changes
    if (userType) {
      console.log("USER TYPE", userType);
      getUser(userType);
    }
  }, [userType]);

  const setType = (type) => {
    setUserType(type); // Set the internal format directly
  };

  console.log("USER TYPE", userType);

  const getUser = (userType) => {
    let data = userType === "all" || userType === "" ? {} : { userType }; // Empty data fetches all users
    console.log("User Type in get user", data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://aquadb-server.onrender.com/admin/getUnverifiesUsers",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setUser(response.data.users || []); // Ensure users is always an array
      })
      .catch((error) => {
        console.log(error);
        setUser([]); // Clear the table if there's an error
      });
  };

  const verifyUser = (id) => {
    const loader = toast.loading("verifying user...");

    let data = {
      id: id,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://aquadb-server.onrender.com/admin/verifyUser",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status == 200) {
          toast.dismiss(loader);
          toast.success("user verified successfully");
          getUser(userType);
        }
      })
      .catch((error) => {
        toast.dismiss(loader);
        console.log(error);
      });
  };

  const rejectUser = (id) => {
    const loader = toast.loading("Rejecting user...");
  
    let data = {
      id: id,
    };
  
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://aquadb-server.onrender.com/admin/rejectUser", // Update the URL endpoint for rejecting
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
  
    axios
      .request(config)
      .then((response) => {
        if (response.status == 200) {
          toast.dismiss(loader);
          toast.success("User rejected successfully");
          getUser(userType); // Refresh the user list
        }
      })
      .catch((error) => {
        toast.dismiss(loader);
        toast.error("Failed to reject user");
        console.log(error);
      });
  };
  

  const getDetails = (id, type) => {
    const loader = toast.loading("getting detail data...");

    let data = {
      userId: id,
      userType: type,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://aquadb-server.onrender.com/admin/get-detail-data",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          setDetailData(response.data.detail);

          toast.dismiss(loader);
          toast.success("Done...");
        }
      })
      .catch((error) => {
        toast.dismiss(loader);
        console.log(error);
      });
  };

  const openmodelfunction = (id, type) => {
    setOpenModal(true);
    getDetails(id, type);
  };
  
  return (
    <>
        <AnimationWrapper className="bg-purple-100 w-full min-h-screen">
          <h1 className="text-bold text-5xl text-center text-gray-900 font-bold p-5">
           New Users Verification
          </h1>

          <div className="flex justify-center items-center gap-20">
            <Button.Group>
              {[
                { label: "All Categories", value: "all" },
                //{ label: "Fisherman", value: "fisherman" },
                {
                  label: "Industry Collaborators",
                  value: "industry-collaborators",
                },
                { label: "Research Institute", value: "research_institute" },
                { label: "Research Cruises", value: "research_cruises" },
                { label: "Scientist", value: "scientist" },
              ].map((type, index) => (
                <Button
                  key={index}
                  onClick={() => setType(type.value)} // Pass the correct internal value
                  className="rounded-xl border-2 text-black hover:text-white border-purple-400 bg-white hover:bg-blue-900 hover:shadow-md m-4"
                >
                  {type.label}
                </Button>
              ))}
            </Button.Group>
          </div>
          <h2 className="text-bold text-2xl text-center text-purple-500 font-bold p-5">
           Kindly verify the follwing users.
          </h2>
          <div className="h-screen w-full">
            <div className="overflow-x-auto ">
              {users.length ? (
                <div className="w-full flex justify-center">
                  <div className="bg-white flex flex-col gap-2 w-4/5 border text-center font-bold border-gray-300 rounded-xl shadow overflow-hidden">
                  <div className="flex">
                  <div className="w-10 h-10 mt-4 ml-4">
                  <img
                      src={unveryfiedusers}
                      className="w-4/5 rounded-full opacity-50"
                      alt="Unverified User"
                  />
                  </div>
                  <h1 className="text-bold text-3xl text-left text-red-900 font-bold p-3"> 
                  Unverified Users
                  </h1>
                  </div>
                    {/* Table Header */}
                    <div className="flex bg-purple-300 text-gray-700 font-semibold text-sm">
  {/* User Type */}
  <div className="w-1/4 py-2 text-center">User Type</div>

  {/* Email */}
  <div className="w-1/4 py-2 text-center">Email</div>

  {/* See Details */}
  <div className="w-1/4 flex justify-center items-center  py-2 text-center">See Details</div>

  {/* Accept/Reject */}
  <div className="w-1/4 flex justify-center gap-12 ">
    <div className=" w-1/5 ml-[1px] py-2 text-center">Accept</div>
    <div className=" w-1/5 py-2 text-center">Reject</div>
  </div>
</div>


                    {/* Table Body */}
                    {users.map((user, i) => (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.13 }}
                      >
                        <div
                          key={user._id}
                          className="flex items-center border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700 transition duration-300 ease-in-out"
                        >
                          {/* Name Column */}
                          <div className="w-1/3 py-3 px-4 text-gray-900 dark:text-white">
                            {user.userType}
                          </div>

                          {/* Email Column */}
                          <div className="w-1/3 py-3 px-4 text-gray-900 dark:text-white">
                            {user.email}
                          </div>

                          {/* See Details Button Column */}
                          <div className="w-1/3 py-3 px-4 text-center">
                            <button
                              onClick={() =>
                                openmodelfunction(user._id, user.userType)
                              }
                              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-cyan-700 transition duration-200"
                            >
                              See Details
                            </button>
                          </div>

                          <div className="w-1/3 py-3 px-4 text-center">
                            <div className="flex justify-center items-center gap-4">
                              {/* Accept Button */}
                              <button
                                onClick={() => verifyUser(user._id)} // Action for Accept
                                className="mx-10 text-3xl rounded-lg flex items-center gap-2 hover:scale-150 transition transform duration-200"
                              >
                               <i class="fa-solid fa-circle-check" style={{"color": "#00FF00"}}></i>
                              </button>
                              {/* Reject Button */}
                              <button
                                onClick={() => rejectUser(user._id)} // Action for Reject
                                className= "mx-10 text-3xl rounded-lg flex items-center gap-2 hover:scale-150 transition transform duration-200"
                              >
                                <i class="fa-solid fa-circle-xmark" style={{"color": "#FF0000"}}></i>
                              </button> 
                            </div>
                          </div>
                      </div>
                      </AnimationWrapper>
                    ))}
                  </div>
                </div>
              ) : (
                <h1 className="text-center mt-12 text-red-900 text-sm">
                  No user found
                </h1>
              )}
            </div>
          </div>
        </AnimationWrapper>
     
        <Modal show={openModal} onClose={() => setOpenModal(false)} className="backdrop-blur-2">
          <button
                onClick={() => setOpenModal(false)} // Add your close functionality here
                className=" absolute right-2 h-10 w-10 text-black rounded-full text-4xl hover:text-gray-600 transition duration-200"
                >
                &times; {/* This represents the "×" symbol */}
            </button>
          {detailData.length ? (
            <div>
              {detailData.map((data, index) => (
                <div key={index} className="space-y-2 px-4  rounded-2xl" >
                  {/* Check the userType and render the appropriate data */}
                  {userType === "fisherman" ? (
                    <>
                      <h1 className="text-xl font-semibold mb-2 p-6">
                        Fishermen Details
                      </h1>
                      <div className="space-y-1">
                        {[
                          {
                            label: "Contact Person",
                            value: data.contact_person.name,
                          },
                          {
                            label: "Contact Person Email",
                            value: data.contact_person.email,
                          },
                          {
                            label: "Contact Person Contact",
                            value: data.contact_person.contact,
                          },
                          {
                            label: "Organisation Name",
                            value: data.organisation_name,
                          },
                          {
                            label: "Organisation Type",
                            value: data.organisation_type,
                          },
                          {
                            label: "Organisation Contact Number",
                            value: data.organisation_contact_number,
                          },
                          {
                            label: "Registration Number",
                            value: data.registration_number,
                          },
                          {
                            label: "Data Contribution Type",
                            value: data.data_contribution_type,
                          },
                          {
                            label: "Geographical Focus Area",
                            value: data.geographical_focus_area,
                          },
                        ].map((field, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg ${
                              idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <p>
                              <strong className="font-semibold">
                                {field.label}:
                              </strong>{" "}
                              {field.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : userType === "industry-collaborators" ? (
                    <>
                      <h1 className="text-xl font-semibold mb-2 p-2">
                        Industry Collaborators Details
                      </h1>
                      <div className="space-y-1">
                        {[
                          {
                            label: "Registration Number",
                            value: data.registration_number,
                          },
                          {
                            label: "Contact Person Name",
                            value: data.contact_person.name,
                          },
                          {
                            label: "Contact Person Email",
                            value: data.contact_person.email,
                          },
                          {
                            label: "Contact Person Contact",
                            value: data.contact_person.contact,
                          },
                          {
                            label: "Organisation Name",
                            value: data.organisation_name,
                          },
                          {
                            label: "Organisation Type",
                            value: data.organisation_type,
                          },
                          {
                            label: "Organisation Contact Number",
                            value: data.organisation_contact_number,
                          },
                          {
                            label: "Data Contribution Type",
                            value: data.data_contribution_type,
                          },
                          {
                            label: "Geographical Focus Area",
                            value: data.geographical_focus_area,
                          },
                        ].map((field, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg ${
                              idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <p>
                              <strong className="font-semibold">
                                {field.label}:
                              </strong>{" "}
                              {field.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : userType === "research_institute" ? (
                    <>
                      <h1 className="text-xl font-semibold mb-2 p-2">
                        Research Institute Details
                      </h1>
                      <div className="space-y-1">
                        {[
                          {
                            label: "Institution Name",
                            value: data.institution_name,
                          },
                          {
                            label: "Institution Code",
                            value: data.institution_code,
                          },
                          {
                            label: "Contact Number",
                            value: data.contact_number,
                          },
                          { label: "Email", value: data.email },
                          {
                            label: "Website",
                            value: (
                              <a
                                href={data.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                              >
                                {data.website}
                              </a>
                            ),
                          },
                          { label: "Country", value: data.country },
                          { label: "Region", value: data.region },
                          {
                            label: "Research Focus",
                            value: data.research_focus,
                          },
                        ].map((field, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg ${
                              idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <p>
                              <strong className="font-semibold">
                                {field.label}:
                              </strong>{" "}
                              {field.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : userType === "research_cruises" ? (
                    <>
                      <h1 className="text-xl font-semibold mb-2 p-2">
                        Research Cruise Details
                      </h1>
                      <div className="space-y-1">
                        {[
                          { label: "Cruise Name", value: data.cruise_name },
                          { label: "Cruise ID", value: data.cruise_id },
                          {
                            label: "Research Institution",
                            value: data.research_institution,
                          },
                          { label: "Cruise Area", value: data.cruise_area },
                          {
                            label: "Objective of Cruise",
                            value: data.objective_of_cruise,
                          },
                          {
                            label: "Contact Number",
                            value: data.contact_number,
                          },
                          { label: "Email", value: data.email },
                        ].map((field, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg ${
                              idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <p>
                              <strong className="font-semibold">
                                {field.label}:
                              </strong>{" "}
                              {field.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p>Invalid User Type</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal>
    </>
  );
};

export default Adminverifyuser;
