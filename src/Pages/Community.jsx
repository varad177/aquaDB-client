import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Community = () => {
    const [name, setName] = useState("");
    const [purpose, setPurpose] = useState("");
    const [error, setError] = useState("");
    const [communities, setCommunities] = useState([]);
    const [scientists, setScientists] = useState([]);
    const [invitations, setInvitations] = useState([]); // State for invitations
    const [loading, setLoading] = useState(false); // Loading state
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false);
    const [currentCommunityId, setCurrentCommunityId] = useState(null);
    const [showInvitationModal, setShowInvitationModal] = useState(false); // Invitation modal state
    const [currentInvitation, setCurrentInvitation] = useState(null); // Current invitation being viewed
    const [animateTable, setAnimateTable] = useState(false);
    let [userId, setUserId] = useState("")
    const navigate = useNavigate();

    const fetchCommunities = async () => {
        const userInSession = localStorage.getItem("aquaUser");
        const { userId } = JSON.parse(userInSession);
        try {
            const response = await axios.post("https://aquadb-server.onrender.com/scientist/fetch-communities", {
                creatorId: userId,
            });
            if (Array.isArray(response.data)) {
                setCommunities(response.data);
            } else {
                setError("Data format is incorrect");
            }
        } catch (error) {
            setError("Error fetching communities");
        }
        setAnimateTable(true);
    };

    useEffect(() => {
      
        fetchCommunities();
    }, []);

    useEffect(() => {
        const fetchScientists = async () => {
            const userInSession = localStorage.getItem("aquaUser");
            const { userId } = JSON.parse(userInSession);
            setUserId(userId);
            try {
                const response = await axios.post("https://aquadb-server.onrender.com/scientist/fetch-scientists");
                if (Array.isArray(response.data)) {
                    setScientists(response.data);
                } else {
                    setError("Error fetching scientists");
                }
            } catch (error) {
                setError("Error fetching scientists");
            }
        };
        fetchScientists();
    }, []);

    useEffect(() => {
        const fetchInvitations = async () => {
            const userInSession = localStorage.getItem("aquaUser");
            const { userId } = JSON.parse(userInSession);
            try {
                setLoading(true); // Start loading
                const response = await axios.post(`https://aquadb-server.onrender.com/scientist/fetch-invitations`, { receiverId: userId });
                setInvitations(response.data);
                setLoading(false); // Stop loading
            } catch (error) {
                setError("Error fetching invitations");
                setLoading(false); // Stop loading
            }
        };
        fetchInvitations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInSession = localStorage.getItem("aquaUser");
        const { userId } = JSON.parse(userInSession);
        try {
            await axios.post("https://aquadb-server.onrender.com/scientist/create-community", {
                name,
                purpose,
                userId,
            });
            setShowCreateCommunityModal(false); // Close the create community modal
            fetchCommunities()
        } catch (error) {
            setError("Error creating community");
        }
    };

    const handleCreateCommunityClick = () => {
        setShowCreateCommunityModal(true); // Open the Create Community modal
    };

    const handleAddMember = async (receiverId) => {
        const userInSession = localStorage.getItem("aquaUser");
        const { userId } = JSON.parse(userInSession);
        try {
            await axios.post("https://aquadb-server.onrender.com/scientist/send-invitation", {
                communityId: currentCommunityId,
                receiverId,
                userId
            });
            alert("Invitation sent!");
        } catch (error) {
            alert("Error sending invitation");
        }
    };

    const handleShowAddMemberModal = (communityId) => {
        setCurrentCommunityId(communityId);
        setShowAddMemberModal(true); // Open the Add Member modal
    };

    const handleInvitationAction = async (invitationId, action) => {

        let userInsession = localStorage.getItem("aquaUser")
        let { userId } = JSON.parse(userInsession)
        try {
            await axios.post("https://aquadb-server.onrender.com/scientist/accept-or-reject-invitation", {
                invitationId,
                action,
                userId
            });
            if (action === "accepted") {
                alert("Invitation accepted");
            } else {
                alert("Invitation rejected");
            }
            setShowInvitationModal(false); // Close the modal
            setInvitations(invitations.filter((inv) => inv._id !== invitationId)); // Remove the invitation from the list
        } catch (error) {
            alert("Error processing invitation");
        }
    };

    const handleShowInvitationModal = (invitation) => {
        setCurrentInvitation(invitation);
        setShowInvitationModal(true); // Open the invitation modal
    };

    return (
        <div className="bg-purple-50 min-h-screen text-gray-900 p-6">
            <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                {/* Top Section */}
                <div className="flex justify-between items-center mb-6">
                    {/* Top Buttons */}
                    <h2 className="text-3xl font-semibold text-black">Communities</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleShowInvitationModal(invitations[0])}
                            className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium shadow-md hover:bg-blue-700 transition duration-300"
                        >
                            View Invitations
                        </button>
                        <button
                            onClick={handleCreateCommunityClick}
                            className="bg-green-600 text-white py-2 px-6 rounded-md font-semibold shadow-md hover:bg-green-700 transition duration-300"
                        >
                            Create New Community
                        </button>
                    </div>

                </div>
    
                {/* Community Table */}
                <div
                    className={`overflow-x-auto transition-all duration-500 ${
                        animateTable ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
                    }`}
                >
                    <table className="w-full table-auto text-md text-gray-800 rounded-md overflow-hidden">
                    <thead>
                            <tr className="bg-purple-300 text-center">
                                <th className="px-6 py-3">Community Name</th>
                                <th className="px-6 py-3">Purpose</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {communities.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                        No communities available.
                                    </td>
                                </tr>
                            ) : (
                                communities.map((community, index) => (
                                    <tr
                                        key={community._id}
                                        className={`border-b border-gray-200 ${
                                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                        }`}
                                    >
                                        <td className="px-6 py-3 text-center">{community.name}</td>
                                        <td className="px-6 py-3 text-center ">{community.purpose}</td>
                                        <td className="px-6 py-3 text-center ">{community.role}</td>
                                        <td className="px-6 py-3 flex justify-center space-x-4">
                                            {community.role === "owner" && (
                                                <button
                                                    onClick={() => handleShowAddMemberModal(community._id)}
                                                    className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-700 transition duration-300"
                                                >
                                                    +Add Member
                                                </button>
                                            )}
                                            <button
    onClick={() => navigate(`/scientist/community/${community._id}`)}
    className="text-white py-2 px-4 transition duration-300 flex items-center justify-center"
>
    <img 
        src="https://media.istockphoto.com/id/845329690/vector/eye-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=1SnGiyGCXd83V7m2hX0EsghFSqtmApJ6Qyy2b8Y3L1k=" 
        alt="Eye Icon" 
        className="h-9 w-9"
    />
</button>

                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
    
            {/* Modals */}
            {/* Create Community Modal */}
            {showCreateCommunityModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white p-8 rounded-xl max-w-lg w-full">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Create New Community</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Community Name"
                                className="w-full p-4 bg-purple-100 text-gray-800 border border-gray-300 rounded-md"
                                required
                            />
                            <textarea
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder="Community Purpose"
                                className="w-full p-4 bg-purple-100 text-gray-800 border border-gray-300 rounded-md"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 transition duration-300"
                            >
                                Create Community
                            </button>
                        </form>
                        <button
                            onClick={() => setShowCreateCommunityModal(false)}
                            className="mt-6 w-full text-center bg-gray-200 text-gray-600 py-3 px-6 rounded-md hover:bg-gray-300 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
    
            {/* Add Member Modal */}
            {showAddMemberModal && currentCommunityId && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white p-8 rounded-xl max-w-lg w-full">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Add Member</h3>
                        {scientists.length === 0 ? (
                            <p className="text-gray-500">No scientists available.</p>
                        ) : (
                            scientists.map((scientist) => (
                                userId !== scientist._id && (
                                    <div
                                        key={scientist._id}
                                        className="flex justify-between items-center bg-purple-100 p-4 mb-4 rounded-md hover:bg-purple-200"
                                    >
                                        <div>
                                            <span className="text-lg font-semibold text-gray-800">{scientist.username}</span>
                                            <span className="text-sm text-gray-500">{scientist.userType}</span>
                                        </div>
                                        <button
                                            onClick={() => handleAddMember(scientist._id)}
                                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                                        >
                                            Add
                                        </button>
                                    </div>
                                )
                            ))
                        )}
                        <button
                            onClick={() => setShowAddMemberModal(false)}
                            className="mt-6 w-full text-center bg-gray-200 text-gray-600 py-3 px-6 rounded-md hover:bg-gray-300 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
    
            {/* Invitation Modal */}
            {showInvitationModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">Invitations</h3>
                        {invitations.length === 0 ? (
                            <p className="text-gray-500">No invitations available.</p>
                        ) : (
                            <table className="w-full table-auto border-collapse text-sm text-gray-800">
                                <thead>
                                    <tr className="bg-purple-200">
                                        <th className="px-4 py-2 text-left">Sender</th>
                                        <th className="px-4 py-2 text-left">Community Name</th>
                                        <th className="px-4 py-2 text-left">Purpose</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invitations.length && invitations.map((invitation) => (
                                        <tr
                                            key={invitation._id}
                                            className="border-b border-gray-200 hover:bg-purple-100"
                                        >
                                            <td className="px-4 py-2">{invitation.sender.email}</td>
                                           
                                            <td className="px-4 py-2">{invitation.status}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleInvitationAction(invitation._id, "accepted")}
                                                    className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300 mb-2"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleInvitationAction(invitation._id, "rejected")}
                                                    className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <button
                            onClick={() => setShowInvitationModal(false)}
                            className="mt-6 w-full text-center bg-gray-200 text-gray-600 py-3 px-6 rounded-md hover:bg-gray-300 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
    
        
};

export default Community;