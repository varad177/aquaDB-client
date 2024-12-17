import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimationWrapper from "./Animation-page";

const Admindatauploadusers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch the user data based on unique userIds from the Catch collection
        const response = await axios.get(
          "https://aquadb-server.onrender.com/admin/get-data-upload-users"
        );
        console.log("response data", response.data);
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching user data.");
      }
    };

    fetchUserData();
  }, []);

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div
      className="lg:rounded-l-2xl"
      style={{
        backgroundImage: "url(/sea_bg.jpg)",
        backgroundSize: "cover",
      }}
    >
      <AnimationWrapper className="rounded-l-2xl min-h-screen p-8 text-white w-[70vw]">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 drop-shadow-lg">
          User Information
        </h1>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {users.map((user, i) => (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.13 }}
                className="bg-white p-6 text-black rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  User ID: {user._id}
                </h2>
                <p className="text-lg mb-2">
                  <strong>Username:</strong> {user.username}
                </p>
                <p className="text-lg mb-2">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-lg mb-6">
                  <strong>User Type:</strong> {user.userType}
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() =>
                      navigate(`/admin/unverify-fish-data/${user._id}`)
                    }
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    See Data
                  </button>
                  <button
                    onClick={() => navigate(`/Research/statistics/${user._id}`)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    View Research
                  </button>
                </div>
              </AnimationWrapper>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-300">No users found.</p>
        )}
      </AnimationWrapper>
    </div>
  );
};

export default Admindatauploadusers;
