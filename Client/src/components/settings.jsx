import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Settings() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    password: "",
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  // Fetch user details on component mount
  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      axios
        .get(`https://expensetracker2-1.onrender.com/users/email/${email}`)
        .then((response) => {
          setUserData((prevUserData) => ({
            ...prevUserData,
            name: response.data.name,
            email: response.data.email,
          }));
        })
        .catch((error) => {
          toast.error("Failed to fetch user details. " + error);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/");
    setShowLogoutModal(false);
    toast.success("Logged out successfully!");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      // Verify current password
      const verifyResponse = await axios.post(
        `https://expensetracker2-1.onrender.com/users/verify-password`,
        {
          email: userData.email,
          currentPassword: userData.currentPassword,
        }
      );

      if (verifyResponse.data.success) {
        // Update password if verification is successful
        await axios.put(
          `https://expensetracker2-1.onrender.com/users/update-password`,
          {
            email: userData.email,
            password: userData.password,
          }
        );
        toast.success("Password updated successfully!");

        // Logout the user after password change
        localStorage.removeItem("email");
        navigate("/");
      } else {
        toast.error("Current password is incorrect.");
      }
    } catch (error) {
      toast.error("Failed to update password. " + error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-purple-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg transform transition-transform duration-300 ease-out">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Settings
        </h1>

        <form onSubmit={handlePasswordChange}>
          <div className="mb-4 flex items-center">
            <i className="fas fa-user mr-3 text-gray-700"></i>
            <label className="block text-gray-700 font-semibold mr-2">
              Name:
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              placeholder="Enter your name"
              value={userData.name}
              disabled
            />
          </div>

          <div className="mb-4 flex items-center">
            <i className="fas fa-envelope mr-3 text-gray-700"></i>
            <label className="block text-gray-700 font-semibold mr-2">
              Email:
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              placeholder="Enter your email"
              value={userData.email}
              disabled
            />
          </div>

          <div className="mb-4 flex items-center">
            <i className="fas fa-lock mr-3 text-gray-700"></i>
            <label className="block text-gray-700 font-semibold mr-2">
              Current Password:
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              placeholder="Enter current password"
              value={userData.currentPassword}
              onChange={(e) =>
                setUserData({ ...userData, currentPassword: e.target.value })
              }
            />
          </div>

          <div className="mb-4 flex items-center">
            <i className="fas fa-lock mr-3 text-gray-700"></i>
            <label className="block text-gray-700 font-semibold mr-2">
              New Password:
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              placeholder="Enter new password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-500 ease-in-out flex items-center justify-center mb-4"
          >
            <i className="fas fa-save mr-2"></i>
            Update Password
          </button>
        </form>

        <button
          type="button"
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 transition-all duration-500 ease-in-out flex items-center justify-center"
          onClick={() => setShowLogoutModal(true)}
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Logout
        </button>

        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
              <p>Are you sure you want to logout?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
