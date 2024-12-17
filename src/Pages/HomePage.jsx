

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "./Animation-page";
import toast from "react-hot-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import aquadb_logo from "../assets/AquaDB.png";
import sea_bg from "../assets/sea_bg.jpg";
import { Button } from "flowbite-react";


const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status on component mount
    const user = localStorage.getItem("aquaUser");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("aquaUser");
    setIsLoggedIn(false); // Reset login state
    navigate("/"); // Redirect to the home page
    toast.success("Logged Out");
  };


  const handleNavigate = () => {
    let userInSession = localStorage.getItem("aquaUser");
    if (userInSession) {

      let { userType } = JSON.parse(userInSession)

      if(userType == 'scientist'){
        navigate('/scientist/home')
        toast.success('Welcome Scientist')
      }else if(userType == "industry-collaborators"){
        navigate('/industry-collaborators/home')
        toast.success('Welcome industry collaborators')
      }else if(userType == "research_cruises"){
        navigate('/research_cruises/home')
        toast.success('Welcome Research Cruises')
      }else if(userType == 'research_institute'){
        navigate('/research-institute/home')
        toast.success('Welcome Research Institute')
      }else if(userType == "admin"){
        navigate('/admin/home')
        toast.success('Welcome Admin Panel')
      }

    }
  }
  return (
    <AnimationWrapper className="flex text-left justify-center items-center h-screen bg-black" >
      <div className="relative w-full h-screen text-center">
        <img
          src={sea_bg}
          className="absolute w-screen h-screen z-0 opacity-50"
          alt="AquaDB"
        />
        {/* Middle: First Lottie Animation */}
        <DotLottieReact
          src="https://lottie.host/013d4466-ea7c-493a-bb8e-38b1cc6d9754/z9Sg4QJMM8.lottie"
          loop
          autoplay
          speed={0.5}
          className="absolute inset-0 w-full h-full z-1"
        />
        <h1 className="text-3xl absolute top-10 left-10 font-extrabold text-white mb-4">
          ASTRAA
        </h1>
        {/* Top: Logo and Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-2">
          {/* Text Content */}
          <div className="flex flex-col gap-4 text-center w-full items-center">
            <h1 className="text-7xl font-extrabold text-white mb-4">
              Welcome to AquaDB
            </h1>
            <p className="text-lg text-white mt-2 text-center w-2/5">
              A Centralized Geo-referenced Fish Catch Database
            </p>
          </div>

          {isLoggedIn ? (
            <div className="w-full my-10">
              <button
                onClick={handleNavigate}
                className="rounded-lg h-fit text-black border-4 border-blue-600 bg-blue-300 hover:bg-blue-400 hover:text-white px-5 py-3 font-bold text-xl transition-all"
              >
              GO TO DASHBOARD
              </button>
            </div>
          ) : (
            <div className="w-full h-fit  flex flex-col gap-10 items-center white justify-center">
              <div className="flex gap-10 mt-10">
                <button
                  onClick={() => navigate("/signin", { state: { userType: "Admin" } })}
                  className="rounded-lg h-fit border-4 border-blue-600 bg-blue-500 hover:bg-blue-600 hover:text-white px-5 py-3 font-bold text-xl text-white transition-all"
                  aria-label="Login as Admin"
                >
                Login as Admin
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="rounded-lg h-fit border-4 border-green-600 bg-green-500 hover:bg-green-600 hover:text-white px-5 py-3 font-bold text-xl text-white transition-all"
                  aria-label="Login as User"
                >
                  Login as User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </AnimationWrapper>
  );
};

export default HomePage;