import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projectName, setProjectName] = useState("");
  const [projectAdminId, setProjectAdminId] = useState(""); // Admin ID will be set from database
  const [projectAdminName, setProjectAdminName] = useState(""); // Admin Name will be set from database
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  // Retrieve admin email from local storage and fetch the admin ID
  useEffect(() => {
    const email = localStorage.getItem("email");
  
    // Fetch the user ID based on the admin email
    const fetchAdminId = async () => {
      try {
        const response = await axios.get(
          `https://expensetracker2-1.onrender.com/users/email/${email}`
        );
        const userId = response.data.id;
        setProjectAdminId(userId);
        const userName = response.data.name; 
        setProjectAdminName(userName); 
      } catch (error) {
        toast.error("Failed to fetch admin ID. "+ error);
      }
    };

    if (email) {
      fetchAdminId();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      project_name: projectName, 
      project_admin_id: projectAdminId,
      start_date: startDate,
      end_date: endDate || null,
    };

    try {
      await axios.post(
        "https://expensetracker2-1.onrender.com/projects",
        projectData
      );
      toast.success("Project created successfully");
      // Reset form
      setProjectName("");
      setStartDate("");
      setEndDate("");
      navigate("/home/members");
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.detail + " Project creation failed!");
      } else {
        toast.error("Project creation failed! Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-10 gap-4 p-1">
      <div className="col-start-1 col-span-10 bg-white rounded-lg font-bold flex items-center pl-5">
        <h3 className="">welcome {projectAdminName},</h3>
      </div>
      <div className="col-start-1 col-span-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full transform transition-transform duration-300 ease-out">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Create New Project
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Project Name:
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                placeholder="Enter project name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Project Admin ID:
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
                value={projectAdminId}
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Project Admin Name:
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
                value={projectAdminName}
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Start Date:
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                End Date:
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-md hover:from-purple-600 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all duration-500 ease-in-out"
            >
              Create Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Projects;
