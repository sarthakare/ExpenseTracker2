import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projectName, setProjectName] = useState("");
  const [projectAdminId, setProjectAdminId] = useState(""); // Admin ID from database
  const [projectAdminName, setProjectAdminName] = useState(""); // Admin Name from database
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userProjects, setUserProjects] = useState([]); // Store filtered user projects

  const navigate = useNavigate();

  // Retrieve admin email from local storage and fetch the admin ID
  useEffect(() => {
    const email = localStorage.getItem("email");

    const fetchAdminId = async () => {
      try {
        const response = await axios.get(
          `https://expensetracker2-1.onrender.com/users/email/${email}`
        );
        const userId = response.data.id;
        setProjectAdminId(userId);
        const userName = response.data.name;
        setProjectAdminName(userName);

        // Fetch all projects
        fetchAllProjects(userId);
      } catch (error) {
        toast.error("Failed to fetch admin ID. " + error);
      }
    };

    if (email) {
      fetchAdminId();
    }
  }, []);

  // Function to fetch all projects
  const fetchAllProjects = async (userId) => {
    try {
      const response = await axios.get(
        "https://expensetracker2-1.onrender.com/projects/"
      );

      // Filter projects by the current admin's ID
      const filteredProjects = response.data.filter(
        (project) => project.project_admin_id === userId
      );
      setUserProjects(filteredProjects); // Store filtered user projects
    } catch (error) {
      toast.error("Failed to fetch projects. " + error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      project_name: projectName,
      project_admin_id: projectAdminId,
      project_admin_name: projectAdminName,
      start_date: startDate,
      end_date: endDate || null,
    };

try {
  const projectResponse = await axios.post(
    "https://expensetracker2-1.onrender.com/projects",
    projectData
  );
  toast.success("Project created successfully");

  const memberData = {
    project_id: projectResponse.data.id, // The newly created project's ID
    member_id: projectAdminId, // The admin's ID
    member_role: "admin", // Set role as 'admin' for the project creator
    project_name: projectName, // Send project name
    member_name: projectAdminName, // Send admin's name
  };

  await axios.post(
    "https://expensetracker2-1.onrender.com/members",
    memberData
  );
  toast.success("Admin added as a member successfully!");

  // Fetch updated list of projects after creation
  fetchAllProjects(projectAdminId);

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
    <div className="min-h-screen grid grid-cols-10 grid-rows-10 gap-4 p-1">
      <div className="col-start-1 col-span-10 bg-white rounded-lg font-bold flex items-center pl-5">
        <h3 className="">Welcome {projectAdminName},</h3>
      </div>
      <div className="col-start-1 col-span-4 row-start-2 row-span-9">
        <div className="bg-white p-4 rounded-lg">
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

      {/* Total Projects Section */}
      <div className="col-start-5 col-span-3 row-start-2 row-span-4 bg-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Total Projects
        </h3>
        <div className="overflow-y-auto max-h-64">
          {" "}
          {/* Set max height and enable scrolling */}
          {userProjects.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-1 py-2 border">Project Name</th>
                  <th className="px-1 py-2 border">Project ID</th>
                  <th className="px-1 py-2 border">Start Date</th>
                  <th className="px-1 py-2 border">End Date</th>
                </tr>
              </thead>
              <tbody>
                {userProjects.map((project) => (
                  <tr key={project.id} className="text-center">
                    <td className="px-1 py-2 border">{project.project_name}</td>
                    <td className="px-1 py-2 border">{project.id}</td>
                    <td className="px-1 py-2 border">{project.start_date}</td>
                    <td className="px-1 py-2 border">
                      {project.end_date ? project.end_date : "Ongoing"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No projects created yet.</p>
          )}
        </div>
      </div>

      {/* Total Expenses Section */}
      <div className="col-start-8 col-span-3 row-start-2 row-span-4 bg-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Total Expenses
        </h3>
      </div>

      {/* Total Transactions Section */}
      <div className="col-start-5 col-span-6 row-start-6 row-span-5 bg-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Total Transactions
        </h3>
      </div>
    </div>
  );
}

export default Projects;
