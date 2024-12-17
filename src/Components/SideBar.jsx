import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import astraaLogo from "../assets/astraa_logo.jpg";
import profImage from "../assets/prof_img.png";

import {
  FaTachometerAlt,
  FaBell,
  FaHome,
  FaPhoneAlt,
  FaSignInAlt,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaBars,
  FaDoorOpen,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("aquaUser");
    if (user) {
      setLogin(true);
      setLoggedUser(JSON.parse(user));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("aquaUser");
    setLogin(false); // Reset login state
    setLoggedUser(null); // Clear loggedUser state
    navigate("/signin");
  };

  const navLinks = [
    {
      to: "/data-upload",
      icon: <FaCloudUploadAlt size={30} />,
      label: "Home",
      key: "home",
    },
    {
      to: "/data-logs",
      icon: <FaBell size={30} />,
      label: "Bell",
      key: "notifications",
    },
    {
      to: "/dashboard",
      icon: <FaTachometerAlt size={30} />,
      label: "Dashboard",
      key: "dashboard",
    },
    {
      to: "/scientist/community",
      icon: <FaPhoneAlt size={30} />,
      label: "community",
      key: "contact",
    },
    {
      to: "/signup",
      icon: <FaSignInAlt size={30} />,
      label: "Login",
      key: "login",
    },
    {
      to: "/dashboard",
      icon: <FaInfoCircle size={30} />,
      label: "About",
      key: "about",
    },
  ];

  const scientistNavLinks = [
    {
      to: "/dashboard",
      icon: <FaTachometerAlt size={20} />,
      label: "Dashboard",
      key: "dashboard",
    },
    {
      to: "/feed",
      icon: <FaCloudUploadAlt size={20} />,
      label: "Feed",
      key: "feed",
    },
    {
      to: "/filter",
      icon: <FaPhoneAlt size={20} />,
      label: "Filter",
      key: "filter",
    },
    {
      to: "/infographics",
      icon: <FaSignInAlt size={20} />,
      label: "Infographics",
      key: "infographics",
    },
    {
      to: "/trends",
      icon: <FaInfoCircle size={20} />,
      label: "Trends",
      key: "trends",
    },
    {
      to: "/scientist/community",
      icon: <FaInfoCircle size={20} />,
      label: "Community",
      key: "community",
    },
    {
      to: "/datasets",
      icon: <FaInfoCircle size={20} />,
      label: "About",
      key: "about",
    },
    {
      to: "/data-upload",
      icon: <FaCloudUploadAlt size={20} />,
      label: "Upload",
      key: "upload",
    },
  ];

  // Filter navLinks based on login state
  const filteredNavLinks = login
    ? navLinks.filter((link) => link.key !== "login")
    : navLinks;

  return (
    <>
      {!isOpen && (
        <button
          className="fixed top-5 left-4 z-50 p-2 text-white rounded-md lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={24} />
        </button>
      )}

      <div
        className={`fixed mt-20 lg:mt-0 top-0 left-0 p-5 h-full text-white flex flex-col border-[#436ec6] transform transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-48 w-64`}
        style={{
          backgroundColor: "#141720",
          // backgroundImage: "url(../../public/nav_bg.jpg)",
          // backgroundSize: "cover",
          // backgroundRepeat: "no-repeat",
          // backgroundPosition: "right",
        }}
      >
        <div className="flex items-center mb-8">
          <div className="w-12 mr-3">
            <img
              src={astraaLogo}
              className="w-full rounded-full"
              alt="astraa_logo"
            />
          </div>
          <h1 className="text-3xl font-bold">
            {/* {loggedUser && loggedUser.userType} */}
            Astraa
          </h1>
        </div>

        <div
          className="bg-white h-[1px] w-full"
          style={{ opacity: "0.1" }}
        ></div>

        <div className="flex items-center my-2">
          <div className="w-10 mr-3">
            <img
              src={profImage}
              className="w-full rounded-full"
              alt="astraa_logo"
            />
          </div>

          <div className="flex flex-col" style={{ maxWidth: "50%" }}>
            <h1 className="text-xl font-semibold">Name</h1>
            <p className="text-md font-large" style={{ opacity: "0.5" }}>
              {loggedUser && loggedUser.userType}
            </p>
          </div>
        </div>

        <div
          className="bg-white h-[1px] w-full mb-8"
          style={{ opacity: "0.1" }}
        ></div>

        <ul className="flex flex-col gap-8 w-full mx-auto">
          {scientistNavLinks.map(({ to, icon, label, key }) => (
            <li key={key} className="">
              <Link
                to={to}
                className="flex gap-3 text-white no-underline hover:bg-purple-500 p-2 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <div className="">{icon}</div>
                <span className="text-sm">{label}</span>
              </Link>
            </li>
          ))}

          <li>
            {loggedUser && (
              <button
                className="py-1 px-3 rounded-md bg-red-600 font-bold text-lg hover:bg-red-700 w-full flex items-center"
                onClick={logout}
              >
                <FaSignInAlt />

                <span className="ml-2">Sign Out</span>
              </button>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
