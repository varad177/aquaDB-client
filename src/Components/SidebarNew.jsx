import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import astraaLogo from "../assets/astraa_logo.jpg";
import profImage from "../assets/prof_img.png";
import { CgProfile } from "react-icons/cg";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import {
  FaTachometerAlt,
  FaCloudUploadAlt,
  FaInfoCircle,
  FaSignInAlt,
  FaBars,
} from "react-icons/fa";

const SidebarNew = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current pathname

  useEffect(() => {
    const user = localStorage.getItem("aquaUser");
    console.log("user", user);
    if (user) {
      const token = JSON.parse(user)?.token;
      if (token) {
        try {
          const base64Payload = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(base64Payload));
          setLoggedUser({
            username: decodedPayload?.username || "Guest",
            userType: decodedPayload?.userType || "N/A",
          });
          setLogin(true);
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("aquaUser");
    setLogin(false);
    setLoggedUser(null);
    navigate("/signin");
  };

  const adminNavLinks = [
    {
      to: "/admin/home",
      icon: <MdOutlineDashboardCustomize className="mt-1 text-2xl" />,
      label: "Dashboard",
    },
    {
      to: "/admin/unverify-user",
      icon: (
        <i
          class="fa-solid fa-users-viewfinder"
          style={{ color: "#ffffff" }}
        ></i>
      ),
      label: "Unverified Users",
    },
    {
      to: "/admin/get-data-upload-user",
      icon: <i class="fa-solid fa-database" style={{ color: "#ffffff" }}></i>,
      label: "Uploaded Data",
    },
    {
      to: "/about",
      icon: (
        <i class="fa-solid fa-address-card" style={{ color: "#ffffff" }}></i>
      ),
      label: "About",
    },
    { to: "/profile", icon: <CgProfile />, label: "Profile" },
  ];

  const defaultNavLinks = [
    {
      to: "/dashboard",
      icon: <FaTachometerAlt size={20} />,
      label: "Dashboard",
    },
    {
      to: "/data-upload",
      icon: <FaCloudUploadAlt size={20} />,
      label: "Upload",
    },
    { to: "/getStatusLogs", icon: <FaInfoCircle size={20} />, label: "Satus Tab" },
    { to: "/about", icon: <FaInfoCircle size={20} />, label: "About" },
    { to: "/profile", icon: <FaSignInAlt size={20} />, label: "Profile" },
  ];

  const scientistNavLinks = [
    {
      to: "/scientist/home",
      icon: <FaTachometerAlt size={20} />,
      label: "Dashboard",
    },
    { to: "/filter", icon: <FaCloudUploadAlt size={20} />, label: "Filter" },
    {
      to: "/graphs",
      icon: <FaInfoCircle size={20} />,
      label: "Infographics",
    },
    {
      to: "/ScientistCharts",
      icon: <FaInfoCircle size={20} />,
      label: "Trends",
    },
    {
      to: "/scientist/community",
      icon: <FaInfoCircle size={20} />,
      label: "Community",
    },
    {
      to: "/scientist/datasets",
      icon: <FaCloudUploadAlt size={20} />,
      label: "Datasets",
    },
  ];

  let navLinks =
    loggedUser?.userType === "admin"
      ? adminNavLinks
      : loggedUser?.userType === "scientist"
      ? scientistNavLinks
      : defaultNavLinks;

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
        className={`fixed top-0 left-0 p-5  h-full  text-white flex flex-col border-[#436ec6] transform transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-52 w-64`}
        style={{ backgroundColor: "#141720" }}
      >
        <div className="flex items-center mb-8">
          <div className="w-12 mr-3">
            <img
              src={astraaLogo}
              className="w-full rounded-full"
              alt="astraa_logo"
            />
          </div>
          <h1 className="text-3xl font-bold">Astraa</h1>
        </div>

        <div className="bg-white h-[1px] w-full opacity-10"></div>

        <div className="flex items-center my-4">
          <div className="w-10 mr-3">
            <img
              src={profImage}
              className="w-full rounded-full"
              alt="prof_img"
            />
          </div>
          <div className="flex flex-col" style={{ maxWidth: "50%" }}>
            <h1 className="text-xl font-semibold">
              {loggedUser?.username || "Guest"}
            </h1>
            {/* <p className="text-md font-large text-opacity-50">
              {loggedUser?.userType || "N/A"}
            </p> */}
            {
              loggedUser?.userType=="research_institute" 
            }
          </div>
        </div>

        <div className="bg-white h-[1px] w-full mb-8 opacity-10"></div>

        <ul className="flex flex-col gap-8 w-full mx-auto">
          {navLinks.map(({ to, icon, label }) => (
            <li key={label}>
              <Link
                to={to}
                className={`flex gap-3 text-white no-underline p-2 rounded-lg ${
                  location.pathname === to
                    ? "bg-purple-500"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="text-xl">{icon}</div>
                <span className="text-sm mt-1">{label}</span>
              </Link>
            </li>
          ))}

          {login && (
            <li>
              <button
                className="py-1 px-3 rounded-md bg-red-600 font-bold text-lg hover:bg-red-700 w-full flex items-center"
                onClick={logout}
              >
                <FaSignInAlt />
                <span className="ml-2">Sign Out</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default SidebarNew;
