import { useState } from "react";
import {useNavigate} from "react-router-dom";

function Settings() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Handle logout confirmation
  const navigate = useNavigate();
  const handleLogout = () => {
    // Here you can implement your logout logic
    navigate("/");
    setShowLogoutModal(false);
  };

  // Handle delete account confirmation
  const handleDeleteAccount = () => {
    // Here you can implement your delete account logic
    console.log("Account deleted");
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-purple-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg transform transition-transform duration-300 ease-out">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Settings
        </h1>

        <form>
          {/* Name Field */}
          <div className="mb-4 flex items-center">
            <i className="fas fa-user mr-3 text-gray-700"></i>
            <label className="block text-gray-700 font-semibold mr-2">
              Name:
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4 flex items-center">
            <i className="fas fa-envelope mr-3 text-gray-700"></i>
            <label className="block text-gray-700 font-semibold mr-2">
              Email:
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              placeholder="Enter your email"
            />
          </div>

          {/* Old Password Field */}
          <div className="mb-4 flex items-center">
            <i className="fas fa-lock mr-3 text-gray-700"></i>
            <label className="block text-gray-700 font-semibold mr-2">
              Old Password:
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              placeholder="Enter your old password"
            />
          </div>

          {/* New Password Field */}
          <div className="mb-4 flex items-center">
            <i className="fas fa-key mr-3 text-gray-700"></i>
            <label className="block text-gray-700 font-semibold mr-2">
              New Password:
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              placeholder="Enter your new password"
            />
          </div>

          {/* Delete Account Button */}
          <div className="mb-4">
            <button
              type="button"
              className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 transition-all duration-500 ease-in-out flex items-center justify-center"
              onClick={() => setShowDeleteModal(true)} // Open Delete Modal
            >
              <i className="fas fa-trash-alt mr-2"></i>
              Delete Account
            </button>
          </div>

          {/* Logout Button */}
          <div>
            <button
              type="button"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-500 ease-in-out flex items-center justify-center"
              onClick={() => setShowLogoutModal(true)} // Open Logout Modal
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </form>

        {/* Logout Confirmation Modal */}
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

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Confirm Delete Account</h2>
              <p>
                Are you sure you want to delete your account? This action is
                irreversible and all your data will be permanently deleted.
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
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
