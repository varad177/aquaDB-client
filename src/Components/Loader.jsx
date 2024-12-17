



import React from "react";
import "./Loader.css";
import logo from '../assets/navlogo.png'

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full relative">
    <div className="loader"></div>
    <img className="w-[250px] rounded-md absolute fade-in-out" src={logo} alt="Logo" />
  </div>
  
  );
};

export default Loader;

