import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Members() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [projectAdminId, setProjectAdminId] = useState("");
  const [projectAdminName, setProjectAdminName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [assignedMembers, setAssignedMembers] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("email");

    // Fetch the user ID based on the admin email
    const fetchAdminId = async () => {
      try {
        const response = await axios.get(
          `https://expensetracker2-1.onrender.com/users/email/${email}`
        );
        const userId = response.data.id; 
        setProjectAdminId(userId); // Set the admin ID
        const userName = response.data.name; 
        setProjectAdminName(userName); // Set the admin name
      } catch (error) {
        toast.error("Failed to fetch admin ID. " + error);
      }
    };

    if (email) {
      fetchAdminId();
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "https://expensetracker2-1.onrender.com/projects"
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects.");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://expensetracker2-1.onrender.com/users"
        );
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
      }
    };

    fetchProjects();
    fetchUsers();
  }, []);

  // Fetch members assigned to the selected project
  useEffect(() => {
    const fetchAssignedMembers = async () => {
      if (selectedProjectId) {
        try {
          const response = await axios.get(
            `https://expensetracker2-1.onrender.com/projects/${selectedProjectId}/members`
          );
          setAssignedMembers(response.data); 
        } catch (error) {
          toast.error("None assigned members. " + error);
        }
      } else {
        setAssignedMembers([]);
      }
    };

    fetchAssignedMembers();
  }, [selectedProjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://expensetracker2-1.onrender.com/members", {
        project_id: selectedProjectId,
        member_id: selectedMemberId,
      });
      toast.success("Member added successfully!");
      setSelectedProjectId("");
      setSelectedMemberId("");
      // Fetch the updated list of assigned members after adding a new member
      const response = await axios.get(
        `https://expensetracker2-1.onrender.com/projects/${selectedProjectId}/members`
      );
      setAssignedMembers(response.data);
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member.");
    }
  };

  // Filter the projects to only include the ones with the matching admin_id
  const filteredProjects = projects.filter(
    (project) => project.project_admin_id === projectAdminId
  );

  // Filter the members to exclude the current admin and already assigned members
  const filteredMembers = members.filter(
    (member) =>
      member.id !== projectAdminId &&
      !assignedMembers.some((m) => m.member_id === member.id)
  );

  return (
    <div className="min-h-screen grid grid-cols-10 grid-rows-10 gap-4 p-1">
      {/* Welcome section */}
      <div className="col-start-1 col-span-10 row-start-1 bg-white rounded-lg font-bold flex items-center pl-5">
        <h3>welcome {projectAdminName},</h3>
      </div>

      {/* Add Members Section */}
      <div className="col-start-1 col-span-4 row-start-2 row-span-9">
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Add Members to Project
          </h2>

          {/* Display Project Admin Info */}
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

          {/* Form to Add Members */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Select Project:
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              >
                <option value="">Select a project</option>
                {filteredProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Assign Member:
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              >
                <option value="">Select a member</option>
                {filteredMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-md hover:from-purple-600 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all duration-500 ease-in-out"
            >
              Add Member
            </button>
          </form>
        </div>
      </div>

      {/* Assigned Members Section */}
      <div className="col-start-5 col-span-6 row-start-2 row-span-4 bg-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Assigned Members
        </h3>
        {assignedMembers.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {assignedMembers.map((member) => (
              <li key={member.member_id} className="">
                {member.member_id}
              </li>
            ))}
          </ul>
        ) : (
          <p className="">No members assigned yet.</p>
        )}
      </div>
    </div>
  );
}

export default Members;
