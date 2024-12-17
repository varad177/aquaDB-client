import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CatchItemDetail from "../Components/Scientist/Community-data";
import { Button, Modal } from "flowbite-react";
import toast from "react-hot-toast";

const Communitydetail = () => {
  const [data, setData] = useState([]); // To store the community data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showComments, setShowComments] = useState({}); // State to track visibility of comments for each community
  const { communityId } = useParams(); // Get the communityId from the URL params
  const [openModal, setOpenModal] = useState(false);
  const [openModalTwo, setOpenModalTwo] = useState(false); // Modal visibility state
  const [id1, setId] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    // Fetch community data
    const fetchCommunityData = async () => {
      try {
        const response = await axios.post(
          "https://aquadb-server.onrender.com/scientist/fetch-community-with-data",
          { communityId }
        );

        if (response.status === 400) {
          toast.error("Community is Empty...");
          return navigate(-1);
        }

        // Handle empty response or no data
        if (!response.data || response.data.length === 0) {
          setError("No data available for this community.");
        } else {
          setData(response.data); // Set the fetched community data
        }
      } catch (err) {
        console.error("Error fetching community data:", err);
        setError("No data available for this community.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  const toggleCommentVisibility = (communityId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [communityId]: !prevState[communityId], // Toggle the visibility of the specific card
    }));
  };

  const handleShareClick = (id) => {
    setId(id);
    setOpenModal(true); // Open the modal
  };

  const generateUrl = (type) => {
    const baseUrl = "http://localhost:5173/scientist/community/share";

    if (!id1) {
      console.error("id is required to generate the URL.");
      return;
    }

    // Encode the communityId with Base64
    const encodedId = btoa(`${id1}-${type}`);
    const url = `${baseUrl}/${encodedId}`;

    // Copy the generated URL to the clipboard
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert(`URL copied to clipboard: ${url}`);
      })
      .catch((error) => {
        console.error("Failed to copy URL to clipboard", error);
      });

    setOpenModal(false); // Close the modal
  };

  // Display loading spinner
  if (loading) return <div className="text-center">Loading...</div>;

  // Display error message
  if (error) {
    return (
      <div className="text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* Share Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Share Community</Modal.Header>
        <Modal.Body>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            How do you want to share this community?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="green" onClick={() => generateUrl("public")}>
            Keep as Public
          </Button>
          <Button color="blue" onClick={() => generateUrl("private")}>
            Keep as Private
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Main Community Details */}
      <div className="min-h-screen text-white bg-purple-100 p-4">
        <h1 className="text-2xl font-bold text-black mb-4">Community Details</h1>
        {Array.isArray(data) && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((community, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-semibold text-black">
                  Community Name: {community.community.name}
                </h2>
                <h3 className="text-lg text-black">
                  Uploaded By: {community.uploadedBy.username}
                </h3>
                <div className="flex gap-20">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md"
                    onClick={() => setOpenModalTwo(true)}
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>

                  <button
                    className="bg-green-600 text-white px-4 py-2 mt-4 rounded-md"
                    onClick={() => handleShareClick(community._id)}
                  >
                    <i className="fa-solid fa-share-nodes"></i>
                  </button>
                </div>
                {/* Modal to show community details */}
                <Modal
                  show={openModalTwo}
                  onClose={() => setOpenModalTwo(false)}
                  size="7xl"
                >
                  <Modal.Header>Community Details</Modal.Header>
                  <Modal.Body>
                    {community.data && community.data.length > 0 ? (
                      community.data.map((catchItem) => (
                        <CatchItemDetail key={catchItem._id} catchItem={catchItem} />
                      ))
                    ) : (
                      <div>No data available for this community.</div>
                    )}
                  </Modal.Body>

                  <Modal.Footer>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-md"
                      onClick={() => setOpenModalTwo(false)} // Close the modal when clicked
                    >
                      Close
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-700 text-lg font-semibold">
            No communities found. Please check back later.
          </div>
        )}
      </div>
    </>
  );
};

export default Communitydetail;
