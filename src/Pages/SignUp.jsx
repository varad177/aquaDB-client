import React, { useEffect, useState } from "react";
import FishermanForm from "../Components/SignUpForms/Fisherman";
import ResearchCruiseForm from "../Components/SignUpForms/ResearchCruise";
import ResearchInstituteForm from "../Components/SignUpForms/ResearchInstitute";
import IndustryCollaboratorForm from "../Components/SignUpForms/IndustryCollaborators";
import { Link, useNavigate } from "react-router-dom";
import ScientistForm from "../Components/SignUpForms/Scientist";
import AnimationWrapper from "./Animation-page"


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [selectedUserType, setSelectedUserType] = useState('fishermen');

  const handleUserTypeClick = (userType) => {
    setSelectedUserType(userType);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };


  const navigate = useNavigate()
  useEffect(() => {

    let user = localStorage.getItem("aquaUser");
    let userInses = JSON.parse(user)
    if (user) {
      // if (userInses.userType == "admin") {
      //   return navigate("/admin/home");
      // } else if (userInses.userType == "scientist") {
      //   return navigate("/scientist/home");
      // }
      return navigate("/")

    }

  }, [])

  return (
    <AnimationWrapper className="flex flex-col lg:flex-row overflow-hidden mx-auto">
      {/* Left Section */}
      <div className="bg-white">
      <div className="w-full lg:w-[40vw] bg-gradient-to-br from-blue-500 to-blue-900 text-white overflow-y-auto h-screen"
      style={{backgroundImage: "url(../../public/sea_bg.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
        <div className="flex flex-col justify-center h-full p-16">
          <h1 className="text-7xl text-left font-bold">Welcome to</h1>
          <h1 className="text-8xl text-left font-bold mb-6">AquaDB</h1>
          <p className="text-xl font-medium mb-10">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum at, eaque sint odio cum cupiditate?
          </p>

          {/* Email Input */}
          <div className="email-input w-full lg:w-3/4">
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 16"
                >
                  <path d="M10.036 8.278L19.294.488A1.979 1.979 0 0018 0H2C1.405 0 .84.236.641.541L10.036 8.278z" />
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 002 2h16a2 2 0 002-2V2.5l-8.759 7.317z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmail}
                className="w-full py-3 px-4 pl-10 rounded-lg border-none text-gray-700 bg-white shadow-lg focus:ring-4 focus:ring-blue-400 placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Right Section */}
      {/* <div
        className={`${
          selectedUserType === null ? "hidden sm:hidden lg:flex" : "flex"
        } w-full lg:w-1/2 bg-white justify-center items-center p-6`}
      >
        {selectedUserType === null ? (
          <div className="text-center text-blue-700">
            <h1 className="text-4xl font-bold mb-4">Welcome to AquaDB!</h1>
            <p className="text-lg">Please select your user type to continue.</p>
          </div>
        ) : (
          <div className="text-center">
            {selectedUserType === "fishermen" && (
              <FishermanForm email={email} />
            )}
            {selectedUserType === "collaborators" && (
              <IndustryCollaboratorForm email={email} />
            )}
            {selectedUserType === "cruisers" && (
              <ResearchCruiseForm email={email} />
            )}
            {selectedUserType === "institutes" && (
              <ResearchInstituteForm email={email} />
            )}
            {selectedUserType === "scientist" && (
              <ScientistForm email={email} />
            )}
          </div>
        )}
      </div> */}

      <div className="bg-white h-[100vh] lg:w-[60vw] p-20">
        {/* User Type Buttons */}
        <div className=" w-full">
          <h1 className="text-5xl font-bold mb-4 text-black">Select User Type</h1>
          {/* Sign In Link */}
          <div className="mt-2 text-left mb-4">
            <p className="text-lg">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-blue-500 hover:text-blue-700"
              >
                Sign In
              </Link>
            </p>
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {["Fishermen", "Collaborators", "Cruisers", "Institutes", "Scientist"].map(
              (type, index) => (
                <button
                  key={index}
                  className={`w-fit-content py-2 px-3 text-center rounded-3xl font-semibold border border-blue-600 transition-all duration-300 ${selectedUserType === type.toLowerCase()
                      ? "bg-blue-600 shadow-lg border-black text-[#ffffff]"
                      : "bg-transparent hover:bg-blue-600 text-blue-600 hover:shadow-lg hover:text-[#ffffff]"
                    }`}
                  onClick={() => handleUserTypeClick(type.toLowerCase())}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        {selectedUserType === null ? (
          <div>
          </div>
        ) : (
          <div className="text-center mt-10">
            {selectedUserType === "fishermen" && (
              <FishermanForm email={email} />
            )}
            {selectedUserType === "collaborators" && (
              <IndustryCollaboratorForm email={email} />
            )}
            {selectedUserType === "cruisers" && (
              <ResearchCruiseForm email={email} />
            )}
            {selectedUserType === "institutes" && (
              <ResearchInstituteForm email={email} />
            )}
            {selectedUserType === "scientist" && (
              <ScientistForm email={email} />
            )}
          </div>
        )}
      </div>
    </AnimationWrapper>
  );
};

export default SignUp;
